'use strict';

var skillDao = require('./skill.dao');
var q = require('q');
var errorHandler = require('../../utils/error.handler');
var utils = require('../../utils/utils');

// TODO: Make the validation more covering
function validateSkill(skill) {
    return q.promise(function(resolve, reject) {
        if (skill && skill.name) {
            skill = utils.extend(getSkillTemplate(), skill);
            return resolve(skill);
        }

        return errorHandler.getHttpError(400)
            .then(reject);
    });
}

function getSkillTemplate() {
    return {
        name: null,
        icon: 'fa fa-flask'
    };
}

exports.createNewSkill = function(skillObject) {
    return validateSkill(skillObject)
        .then(skillDao.createNewSkill);
};

exports.getSkillByName = function(name) {
    return skillDao.getSkillByName(name);
};

exports.getSkillById = function(id) {
    return skillDao.getSkillById(id);
};

exports.getAllSkills = function() {
    return skillDao.getAllSkills();
};

exports.deleteSkillById = function(id) {
    return skillDao.deleteSkillById(id);
};
