'use strict';

/**
 * Module dependencies.
 */
var q = require('q');
var authenticationMiddleware = require('./authentication.middleware');
var userController = require('../chains/user/user.controller');
var errorHandler = require('../utils/error.handler');
var utils = require('../utils/utils');
var responseHandler = require('../utils/response.handler');
var NodeCache = require('node-cache');
var roleController = require('../chains/role/role.controller');
var roleToAttributeController = require('../chains/roleToAttributeConnector/roleToAttributeConnector.controller');
var attributeController = require('../chains/attribute/attribute.controller');
var cacheHandler = require('../utils/cache.handler');

// middleware
exports.authentication = function(request, response, next) {
    var email = request.headers['x-forwarded-email'];
    var name = request.headers['x-forwarded-user'];

    if (!email) {
        return responseHandler.sendUnauthorizedResponse(response)();
    }

    if (cacheHandler.getFromUserRoleCache(email)) {
        return next();
    } else {
        userController.createUserIfNonexistent(name, email)
            .then(setUserRoleCache)
            .then(responseHandler.sendToNext(next))
            .catch(responseHandler.sendErrorResponse(response));
    }
};

exports.isAllowed = function(attribute) {
    return function(request, response, next) {
        getUserRole(request, response)
            .then(getRoleAttributes)
            .then(function(attributes) {
                if (attributes !== undefined && attributes.indexOf(attribute) >= 0) {
                    return next();
                } else {
                    return responseHandler.sendUnauthorizedResponse(response)();
                }
            })
            .catch(responseHandler.sendUnauthorizedResponse(response));
    };
};

function getUserRole(request, response) {
    return q.promise(function(resolve) {
        var email = request.headers['x-forwarded-email'];
        var userRoleFromCache = cacheHandler.getFromUserRoleCache(email);
        if (!userRoleFromCache) {
            return userController.getUserByEmail(email)
                .then(setUserRoleCache)
                .then(resolve)
                .catch(responseHandler.sendUnauthorizedResponse(response));
        }

        return resolve(userRoleFromCache);
    });
}

function setUserRoleCache(user) {
    return q.promise(function(resolve) {
        cacheHandler.setToUserRoleCache(user.email, user.role);
        return resolve(user.role);
    });
}

function getRoleAttributes(role) {
    return q.promise(function(resolve, reject) {
        var roleAttributes = cacheHandler.getFromRoleAttributesCache(role);
        if (!roleAttributes) {
            var connectors = roleController.getRoleByName(role)
                .then(roleToAttributeController.getRoleToAttributeConnectorsByRole)

            var attributes = attributeController.getAllAttributes()

            q.all([connectors, attributes])
                .then(function() {
                    return utils.extractPropertiesFromConnectors('attributeId', connectors.value())
                        .then(utils.matchListAndObjectIds(attributes.value()))
                        .then(utils.extractPropertyFromList('name'))
                        .then(function(attributeNames) {
                            cacheHandler.setToRoleAttributesCache(role, attributeNames);
                            return resolve(attributeNames);
                        });
                })
                .catch(reject);
        } else {
            return resolve(roleAttributes);
        }
    });
}
