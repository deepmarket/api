
"use strict";

let chai = require('chai');
let chai_http = require('chai-http');
let expect = chai.expect;

let utils = require('./utils');
let server = require('../app').server;
let customer = require('../api/models/customer_model');

chai.should();
chai.use(chai_http);

process.env.API_TEST = true;

describe("Account: Create", function() {
    beforeEach("Remove Users", function() {
        customer.remove({}, (err) => {
            if(err) {
                console.error(`ERROR: ${err}`);
            }
        });
    });

    describe('Create: Good new user', function() {
        it("Good new user: should return a token upon successful creation", function(done) {
            chai.request(server)
                .post(`/api/v1/account`)
                .send(utils.TEST_USER)
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');

                    // noinspection BadExpressionStatementJS
                    expect(res).to.be.json;

                    ["success", "message", "error"].forEach(val => {
                        res.body.should.have.a.property(val);
                    });
                    res.body.success.should.be.eql(true);
                    done();
            });
        });
    });

    describe('Create: Bad new user', function() {
        it("Bad new user: should not return a token and 403", function(done) {
            chai.request(server)
                .post(`/api/v1/account`)
                .send({})  // Create bad account
                .end(function(err, res) {

                    res.should.have.status(400);
                    res.body.should.be.a('object');

                    // noinspection BadExpressionStatementJS
                    expect(res).to.be.json;

                    ["success", "message", "error"].forEach(val => {
                        res.body.should.have.a.property(val);
                    });
                    res.body.success.should.be.eql(false);
                    done();
                });
        });
    });

    describe("Fetch: Good user", function() {
        it("Good user: should return a good users account", function (done) {
            // Create a new user.
            chai.request(server)
                .post(`/api/v1/account`)
                .send(utils.TEST_USER)
                .end(function(err, res) {
                    let token = res.body.token;

                    chai.request(server)
                        .get(`/api/v1/account`)
                        .set({"x-access-token": token})
                        .end(function(err, res) {
                            res.should.have.status(200);
                            res.body.should.be.a('object');

                            // noinspection BadExpressionStatementJS
                            expect(res).to.be.json;

                            ["success", "message", "error"].forEach(val => {
                                res.body.should.have.a.property(val);
                            });
                            res.body.success.should.be.eql(true);
                            done();
                        });
                });
        });
    });

    describe("Delete: Good user", function() {
        it("Good user: should delete a good users account", function (done) {
            // This seems janky.
            chai.request(server)
                .post(`/api/v1/account`)
                .send(utils.TEST_USER)
                .end(function(err, res) {
                    let token = res.body.token;

                    chai.request(server)
                        .delete(`/api/v1/account`)
                        .set({"x-access-token": token})
                        .end(function(err, res) {
                            res.should.have.status(200);
                            res.body.should.be.a('object');

                            // noinspection BadExpressionStatementJS
                            expect(res).to.be.json;

                            ["success", "message", "error"].forEach(val => {
                                res.body.should.have.a.property(val);
                            });
                            res.body.success.should.be.eql(true);
                            done();
                        });
                });
        });
    });
});