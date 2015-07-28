'use strict';

/**
 * Module dependencies.
 */
var responseHandler = require('../utils/response.handler');
var authenticationHandler = require('../utils/authentication.handler');

var q = require('q');

// middleware
exports.authentication = function(request, response, next) {
    var email = request.headers['x-forwarded-email'];
    var name = request.headers['x-forwarded-user'];

    if (!email) {
        return responseHandler.sendUnauthorizedResponse(response)();
    }

    authenticationHandler.authenticate(name, email)
        .then(responseHandler.sendToNext(next))
        .catch(responseHandler.sendErrorResponse(response));
};

exports.isAllowedOrSelf = function(attribute) {
    return function(request, response, next) {

        var userIsSelf = authenticationHandler.isSelf(request.headers['x-forwarded-email'], request.params.id);

        return q.all(userIsSelf)
            .then(function(result) {
                if (result) {
                    return next();
                } else {
                    return exports.isAllowed(attribute)(request, response, next);
                }
            });
    };
};

exports.isAllowed = function(attribute) {
    return function(request, response, next) {
        return authenticationHandler.getUserAttributeNames(request.headers['x-forwarded-email'])
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
