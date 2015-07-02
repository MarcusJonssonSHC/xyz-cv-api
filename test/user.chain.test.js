'use strict';

var server = require('../app/server');
var request = require('supertest');
var expect = require('expect.js');
var url = 'http://localhost:9000';
var nock = require('nock');
var config = require('config');
var mockedUrl = config.API_URL;

//===============================================================================

describe('/api/user', function() {

    afterEach(function(done) {
        nock.cleanAll();
        done();
    });

    var getUserByEmailResponse = [{
        _id:'558bacd8ed289d0f00d2c5f3',
        email:'a@softhouse.se',
        name:'A',
        createdAt:'2015-06-25T07:25:12.523Z',
        updatedAt:'2015-06-25T07:25:12.523Z'
    }];

    //==============================================================================

    it('should reply with HTTP status code 200 and a correctly formatted JSON object when getting all users', function(done) {
        var resultAllGet = [{
            _id: '557700a57b0f141400e8ceac',
            email: 'a@softhouse.se',
            name: 'A',
            createdAt: '2015-06-09T15:05:09.352Z',
            updatedAt: '2015-06-09T15:05:09.352Z'
        }];

        nock(mockedUrl)
            .get('/user')
            .reply(200, resultAllGet)

            .get('/user?email=a@softhouse.se')
            .reply(200, getUserByEmailResponse);

        request(url)
            .get('/api/user')
            .set('x-forwarded-email', 'a@softhouse.se')
            .set('x-forwarded-user', 'A')
            .set('Content-Type', 'application/json')
            .send()

            // end handles the response
            .end(function(err, res) {
                if (err) {
                    throw err;
                }

                expect(res).to.exist;
                expect(res.status).to.equal(200);
                expect(JSON.stringify(res.body[0])).to.equal(JSON.stringify(resultAllGet[0]));
                done();
            });
    });

    //===============================================================================

    it('should reply with HTTP status code 200 and a correctly formatted JSON object when getting a user by id', function(done) {
        var resultGetOne = {
            _id: '1234',
            name: 'test3',
            createAt: '2015-06-15T15:43:31.035Z',
            updatedAt: '2015-06-15T15:43:31.035Z'
        };

        nock(mockedUrl)
            .get('/user/1234')
            .reply(200, resultGetOne)

            .get('/user?email=a@softhouse.se')
            .reply(200, getUserByEmailResponse);

        request(url)
            .get('/api/user/1234')
            .set('x-forwarded-email', 'a@softhouse.se')
            .set('x-forwarded-user', 'A')
            .set('Content-Type', 'application/json')
            .send()

            // end handles the response
            .end(function(err, res) {
                if (err) {
                    throw err;
                }

                expect(res).to.exist;
                expect(res.status).to.equal(200);
                expect(JSON.stringify(res.body)).to.equal(JSON.stringify(resultGetOne));
                done();
            });
    });

    //===============================================================================

    it('should reply with HTTP status code 404 and a correctly formatted string when getting a user not in the database by id', function(done) {
        var resultNotInDb = 'No item with the given id was found.';

        nock(mockedUrl)
            .get('/user/123')
            .reply(404, resultNotInDb)

            .get('/user?email=a@softhouse.se')
            .reply(200, getUserByEmailResponse);

        request(url)
            .get('/api/user/123')
            .set('x-forwarded-email', 'a@softhouse.se')
            .set('x-forwarded-user', 'A')
            .set('Content-Type', 'application/json')
            .send()

            // end handles the response
            .end(function(err, res) {
                expect(err).to.exist;
                expect(res).to.exist;
                expect(res.status).to.equal(404);
                expect(res.error.text).to.equal(resultNotInDb);
                done();
            });
    });

    //===============================================================================

    it('should reply with HTTP status code 200 and a correctly formatted JSON object when deleting an existing user', function(done) {
        var resultDelete = {
            message: 'The item was successfully removed.'
        };

        nock(mockedUrl)
            .delete('/user/1234')
            .reply(204, {})

            .get('/user?email=a@softhouse.se')
            .reply(200, getUserByEmailResponse);

        request(url)
            .delete('/api/user/1234')
            .set('x-forwarded-email', 'a@softhouse.se')
            .set('x-forwarded-user', 'A')
            .set('Content-Type', 'application/json')
            .send()

            // end handles the response
            .end(function(err, res) {
                if (err) {
                    throw err;
                }

                expect(res).to.exist;
                expect(res.status).to.equal(200);
                expect(JSON.stringify(res.body)).to.equal(JSON.stringify(resultDelete));
                done();
            });
    });

    //===============================================================================

    it('should reply with HTTP status code 404 and a correctly formatted string when deleting a user not in the database', function(done) {
        var resultNotInDb = 'No item with the given id was found.';

        nock(mockedUrl)
            .delete('/user/123')
            .reply(404, resultNotInDb)

            .get('/user?email=a@softhouse.se')
            .reply(200, getUserByEmailResponse);

        request(url)
            .delete('/api/user/123')
            .set('x-forwarded-email', 'a@softhouse.se')
            .set('x-forwarded-user', 'A')
            .set('Content-Type', 'application/json')
            .send()

            // end handles the response
            .end(function(err, res) {
                expect(err).to.exist;
                expect(res).to.exist;
                expect(res.status).to.equal(404);
                expect(res.error.text).to.equal(resultNotInDb);
                done();
            });
    });

    //===============================================================================

    it('5 should reply with HTTP status code 204 and a correctly formatted string when updating a user\'s role', function(done) {
        var resultPut = {message:'The user was updated successfully.'};

        var body = {
            role: 'newRole'
        };

        var user = {
            _id: '123',
            email: 'A@softhouse.se',
            name: 'A',
            role: 'role1',
            createdAt: '2015-06-22T13:28:23.982Z',
            updatedAt: '2015-06-23T11:26:13.809Z'
        };

        nock(mockedUrl)
            .put('/user/123')
            .reply(204)

            .get('/user/123')
            .reply(200, user)

            .get('/user?email=a@softhouse.se')
            .reply(200, getUserByEmailResponse);

        request(url)
            .put('/api/user/123')
            .set('x-forwarded-email', 'a@softhouse.se')
            .set('x-forwarded-user', 'A')
            .set('Content-Type', 'application/json')
            .send(body)

            // end handles the response
            .end(function(err, res) {
                expect(err).to.exist;
                expect(res).to.exist;
                expect(res.status).to.equal(200);
                expect(JSON.stringify(res.body)).to.equal(JSON.stringify(resultPut));
                done();
            });
    });

    //===============================================================================

    it('should reply with HTTP status code 400 and a correctly formatted string when updating a user\'s role not in database', function(done) {

        var resultPutNotInDb = 'No item with the given id was found.';

        var resultPut = {
            message: 'The user was updated successfully.'
        };

        var body = {
            role: 'newRole'
        };

        var user = {
            _id: '123',
            email: 'A@softhouse.se',
            name: 'A',
            role: 'role1',
            createdAt: '2015-06-22T13:28:23.982Z',
            updatedAt: '2015-06-23T11:26:13.809Z'
        };

        nock(mockedUrl)
            .put('/user/123')
            .reply(204, resultPut)

            .get('/user/123')
            .reply(404, resultPutNotInDb)

            .get('/user?email=a@softhouse.se')
            .reply(200, getUserByEmailResponse);

        request(url)
            .put('/api/user/123')
            .set('x-forwarded-email', 'a@softhouse.se')
            .set('x-forwarded-user', 'A')
            .set('Content-Type', 'application/json')
            .send(body)

            // end handles the response
            .end(function(err, res) {
                expect(err).to.exist;
                expect(res).to.exist;
                expect(res.status).to.equal(404);
                expect(res.error.text).to.equal(resultPutNotInDb);
                done();
            });
    });

    //==============================================================================

});
