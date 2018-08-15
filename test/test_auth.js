"use strict";

let chai = require('chai');
let chai_http = require('chai-http');
let expect = chai.expect;
let mongoose = require('mongoose');

let utils = require('./utils');
let app = require('../app');
let customer = require('../api/models/customer_model');

chai.should();
chai.use(chai_http);

process.env.API_TEST = true;

describe("Customer: Auth", function() {
    var server;

    // before("Add a user account to the database to interact with", async function() {
    //     // console.log("Creating user account");
    //     // try {
    //     //     await utils.add_test_user();
    //     // } catch(err) {
    //     //     console.error(err);
    //     // }
    //     // console.log("User account created");
    // });
    //
    // after("Remove the user account from the database", async function() {
    //     console.log("Removing user account");
    //     utils.delete_test_user().catch(err => {console.error(err)});
    // });

    // And of course we need to setup/teardown our server.
    beforeEach("Instantiate server", function() {
        customer.remove({}, (err) => {
            done();
        });
        // server = app.create();
        // console.log("Creating clean server for test.");
    });

    afterEach("Tear down server", function() {
        server.close();
        // expect(res).to.be(0);
        console.log("Closing server from test.");
    });

    describe('Auth: Login', function() {
        it("Login: should return a token upon successful login", function(done) {
            chai.request(server).post(`/api/v1/auth/login`).send({
                "email": utils.CUSTOMER_PAYLOAD.email,
                "password": utils.CUSTOMER_PAYLOAD.password,
            }).end(function(err, res) {
                console.log("message: ", res.body.message);
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    // noinspection BadExpressionStatementJS
                    expect(res).to.be.json;

                    ["success", "message", "error"].forEach(val => {
                        res.body.should.have.a.property(val);
                    });
                    res.body.success.should.be.eql(true);
                    res.body.auth.should.be.eql(true);
                    done();
                });
        });
    });

    // it("should allow the user the logout", function(done) {
    //     done();
    // });
});

// let server
// before(function(done) {
//     this.enableTimeouts(false);
//         server = require('../app')
//     server.initialize()
//         .then(() => {
//             console.info('listening on', process.env.PORT)
//             server.listen(process.env.PORT, done)
//         })
//         .catch(err => {
//             console.log(err)
//             done(err)
//         })
// });