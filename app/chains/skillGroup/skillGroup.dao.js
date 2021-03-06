'use strict';

var request = require('request-promise');
var config = require('config');
var q = require('q');
var responseHandler = require('../../utils/response.handler');
var errorHandler = require('../../utils/error.handler');

var url = config.API_URL + 'skillGroup';

exports.createNewSkillGroup = function(skillGroup) {
    var options = {
        resolveWithFullResponse: true,
        uri: url,
        method: 'POST',
        json: skillGroup
    };

    return request(options)
        .then(responseHandler.parsePost)
        .catch(errorHandler.throwDREAMSHttpError);
};

exports.getSkillGroupByName = function(name) {
    var options = {
        resolveWithFullResponse: true,
        uri: url + '?name=' + name,
        method: 'GET'
    };

    return request(options)
        .then(responseHandler.parseGetMonoQuery)
        .catch(errorHandler.throwDREAMSHttpError);
};

exports.getSkillGroupById = function(id) {
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

exports.getAllSkillGroups = function() {
    var options = {
        resolveWithFullResponse: true,
        uri: url,
        method: 'GET'
    };

    return request(options)
        .then(responseHandler.parseGetPolyQuery)
        .catch(errorHandler.throwDREAMSHttpError);
};

exports.deleteSkillGroupById = function(id) {
    var options = {
        resolveWithFullResponse: true,
        uri: url + '/' + id,
        method: 'DELETE'
    };

    return request(options)
        .then(responseHandler.parseDelete)
        .catch(errorHandler.throwDREAMSHttpError);
};
