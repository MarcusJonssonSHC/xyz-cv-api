'use strict';

var request = require('request-promise');
var q = require('q');
var config = require('config');
var responseHandler = require('../utils/response.handler');
var errorHandler = require('../utils/error.handler');

var url = config.API_URL + 'attribute';

exports.createNewAttribute = function(attribute) {
    var options = {
        resolveWithFullResponse: true,
        uri: url,
        method: 'POST',
        json: attribute
    };

    return request(options)
        .then(responseHandler.parsePost)
        .catch(errorHandler.throwDREAMSHttpError);
};

exports.getAttributeById = function(id) {
    var options = {
        resolveWithFullResponse: true,
        uri: url + '/' + id,
        method: 'GET',
        json: true
    };

    return request(options)
        .then(responseHandler.parseGet)
        .catch(errorHandler.throwDREAMSHttpError);
};

exports.getAttributeByName = function(name) {
    var options = {
        resolveWithFullResponse: true,
        uri: url + '?name=' + name,
        method: 'GET'
    };

    return request(options)
        .then(responseHandler.parseGetMonoQuery)
        .catch(errorHandler.throwDREAMSHttpError);
};

exports.getAllAttributes = function() {
    var options = {
        resolveWithFullResponse: true,
        uri: url,
        method: 'GET'
    };

    return request(options)
        .then(responseHandler.parseGetPolyQuery)
        .catch(errorHandler.throwDREAMSHttpError);
};

exports.deleteAttributeById = function(id) {
    var options = {
        resolveWithFullResponse: true,
        uri: url + '/' + id,
        method: 'DELETE'
    };

    return request(options)
        .then(responseHandler.parseDelete)
        .catch(errorHandler.throwDREAMSHttpError);
};
