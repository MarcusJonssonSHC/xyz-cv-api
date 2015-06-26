'use strict';

var request = require('request');
var q = require('q');
var config = require('config');
var responseHandler = require('../utils/response.handler');

var url = config.API_URL + 'user';

exports.createNewUser = function(user) {
    var options = {
        uri: url,
        method: 'POST',
        json: user
    };

    return q.nfcall(request, options)
        .then(responseHandler.parseResponse)
        .then(responseHandler.parsePost);
};

exports.updateUser = function(user) {
    var options = {
        uri: url + '/' + user._id,
        method: 'PUT',
        json: user
    };

    return q.nfcall(request, options)
        .then(responseHandler.parsePut);
};

exports.getUserById = function(id) {
    var options = {
        uri: url + '/' + id,
        method: 'GET',
        json: true
    };

    return q.nfcall(request, options)
        .then(responseHandler.parseResponse)
        .then(responseHandler.parseGet);
};

exports.getUserByEmail = function(email) {
    var options = {
        uri: url + '?email=' + email,
        method: 'GET'
    };

    return q.nfcall(request, options)
        .then(responseHandler.parseResponse)
        .then(responseHandler.parseGet)
        .then(responseHandler.parseMonoQuery);
};

exports.getAllUsers = function() {
    var options = {
        uri: url,
        method: 'GET'
    };

    return q.nfcall(request, options)
        .then(responseHandler.parseResponse)
        .then(responseHandler.parseGet)
        .then(responseHandler.parsePolyQuery);
};

exports.deleteUserById = function(id) {
    var options = {
        uri: url + '/' + id,
        method: 'DELETE'
    };

    return q.nfcall(request, options)
        .then(responseHandler.parseResponse)
        .then(responseHandler.parseDelete);
};
