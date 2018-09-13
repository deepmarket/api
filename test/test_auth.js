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

describe("Customer: Auth", function() {
    beforeEach("Remove All Users; Create New User", function() {
        customer.remove({}, (err) => {
            if(err) {
                console.error(`${err}`);
            }
        });
    });

    // This is required I guess?
    after("Remove All Users; Create New User", function() {
        customer.remove({}, (err) => {
            if(err) {
                console.error(`${err}`);
            }
        });
    });

    describe('Auth: Successful Login', function() {
        it("Login: should return a token upon successful login", function(done) {
            chai.request(server)
                .post(`/api/v1/account`)
                .send(utils.TEST_USER)
                .end(function(err) {

                    chai.request(server)
                        .post(`/api/v1/auth/login`)
                        .send(utils.TEST_USER_CREDENS)
                        .end(function(err, res) {
                            console.log("message: ", res.body.message);

                            res.should.have.status(200);
                            res.body.should.be.a('object');

                            // noinspection BadExpressionStatementJS
                            expect(res).to.be.json;

                            ["success", "message", "error"].forEach(val => {
                                res.body.should.have.a.property(val);
                            });
                            res.body.success.should.be.eql(true);
                            res.body.token.should.not.be.eql("");
                            res.body.auth.should.be.eql(true);
                            done();
                        });
                });
        });
    });

    describe('Auth: Unuccessful Login', function() {
        it("Login: should return a token upon successful login", function(done) {
            chai.request(server)
                .post(`/api/v1/account`)
                .send(utils.TEST_USER)
                .end(function(err) {

                    chai.request(server)
                        .post(`/api/v1/auth/login`)
                        .send({})
                        .end(function(err, res) {
                            res.should.have.status(401);
                            res.body.should.be.a('object');

                            // noinspection BadExpressionStatementJS
                            expect(res).to.be.json;

                            ["success", "message", "error"].forEach(val => {
                                res.body.should.have.a.property(val);
                            });
                            res.body.success.should.be.eql(false);
                            // noinspection BadExpressionStatementJS
                            expect(res.body.token).to.be.null;
                            res.body.auth.should.be.eql(false);
                            done();
                        });
                });
        });
    });
});
