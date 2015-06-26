'use strict';

var userDao = require('../dao/user.dao');
var q = require('q');
var errorHandler = require('../utils/error.handler');

// TODO: Make the validation more covering
function validateUser(user) {
    return q.promise(function(resolve, reject) {
        if (user && user.name && user.email && user.role) {
            return resolve(user);
        }

        return errorHandler.getHttpError(400)
            .then(reject);
    });
}

function getUserTemplate(name, email) {
    return {
        email: email,
        name: name,
        role: 'user'
    };
}

function setUserProperties(body) {
    function extend(user, props) {
        for (var prop in user) {
            if (user.hasOwnProperty(prop) && props.hasOwnProperty(prop)) {
                user[prop] = props[prop];
            }
        }
    }

    return function(user) {
        extend(user, body);
        return user;
    };
}

exports.updateUser = function(id, body, email) {
    return exports.getUserById(id)
        .then(setUserProperties(body))
        .then(userDao.updateUser);
};

exports.getUserById = function(id) {
    return userDao.getUserById(id);
};

exports.createNewUser = function(user) {
    return validateUser(user)
        .then(userDao.createNewUser);
};

exports.createUserIfNonexistent = function(name, email) {
    return exports.getUserByEmail(email)
        .then(function(user) {
            return q.promise(function(resolve, reject) {
                if (!user) {
                    exports.createNewUser(getUserTemplate(name, email))
                    .then(resolve);
                } else {
                    return resolve(user);
                }
            });
        });
};

exports.getUserByEmail = function(email) {
    return userDao.getUserByEmail(email);
};

exports.getAllUsers = function() {
    return userDao.getAllUsers();
};

exports.deleteUserById = function(id) {
    return userDao.deleteUserById(id);
};
