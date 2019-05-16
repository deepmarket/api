
"use strict";

const bcrypt = require("bcrypt");
const chai = require('chai');
const chai_http = require('chai-http');
const jwt = require("jsonwebtoken");
const expect = chai.expect;

const config = require('../api/config/config');
const db = require('../db');
const Customer = require(`./api/models/account_model`);

chai.should();
chai.use(chai_http);

process.env.API_TEST = true;

const TEST_USER  = {
    firstname: "Felix",
    lastname: "Da Housecat",
    email: "abc@123.com",
    password: "password",
    status: "Active",
};

const TEST_USER_CREDENS = {
    email: "abc@123.com",
    password: "password",
};

// async function create_test_account() {
//     return new Promise(function(resolve, reject) {
//         describe('Account: Create', async function () {
//             var server;
//             beforeEach("Instantiate server", () => {
//                 console.log("\tNOTICE: Starting server in utils beforeEach");
//                 server = require('../app').server;
//             });
//
//             afterEach("Tear down server", () => {
//                 console.log("\tNOTICE: closing server in utils afterEach");
//                 require('../app').stop();
//             });
//
//             it('Create: should create a new-user account', function (done) {
//                 chai.request(server).post('/api/v1/account')
//                     .send(TEST_USER)
//                     .end(function (err, res) {
//                         // res.should.have.status(200);
//                         // res.body.should.be.a('object');
//                         // // noinspection BadExpressionStatementJS
//                         // expect(res).to.be.json;
//                         //
//                         // ["success", "message", "error"].forEach(val => {
//                         //     res.body.should.have.a.property(val);
//                         // });
//                         // res.body.success.should.be.eql(true);
//                         // expect(res.body.error).to.be.null();
//                         TEST_USER.token = res.body.token;
//                         if(res.status === 200) {
//                             console.log(res.status);
//                             resolve(res.body);
//                         } else {
//                             console.log(res.status);
//                             reject(res.body);
//                         }
//                         done();
//                     });
//             });
//         })
//     });
// }

// function create_test_account() {
//     console.log("Inside sexy new setup function");
//     return new Promise((resolve, reject) => {
//         let user;
//
//         bcrypt.hash(TEST_USER.password, config.SALT_ROUNDS, (err, hash) => {
//             if(err) {
//                 reject(err);
//             }
//
//             user = new Customer({
//                 firstname: TEST_USER.firstname,
//                 lastname: TEST_USER.lastname,
//                 email: TEST_USER.email,
//                 password: hash,
//                 status: "Active",
//             });
//
//             user.save((err, new_user_id) => {
//                 if (err) {
//                     if (err.code === 11000) {
//                         reject(err);
//                     }
//                 } else {
//
//                     TEST_USER.user_id = new_user_id;
//
//                     jwt.sign({id: new_user_id}, config.JWT_KEY, {expiresIn: '24h'}, (err, token) => {
//                         if(err) {
//                             reject(err);
//                         } else {
//                             TEST_USER.token = token;
//                             console.log("Finally created new token; resolving");
//                             resolve();
//                         }
//                     });
//                 }
//             });
//         });
//     });
// }

async function add_test_user() {
    db.open_connection(config.TEST_DB_URI, process.env.API_TEST);

    let user, new_user_id, token;

    try {
        console.log("before hash");
        let hash = await bcrypt.hash(TEST_USER.password, config.SALT_ROUNDS);

        user = new Customer({
            firstname: TEST_USER.firstname,
            lastname: TEST_USER.lastname,
            email: TEST_USER.email,
            password: hash,
            status: "Active",
        });

        new_user_id = await user.save();

        console.log("Saved user");

        token = await jwt.sign({id: new_user_id}, config.JWT_KEY, {expiresIn: '24h'});

    } catch(err) {
        console.error(`ERROR: ${err}`);
    } finally {
        TEST_USER.user_id = new_user_id;
        TEST_USER.token = token;

        console.log(`PAYLOAD token(${TEST_USER.token})`);
        db.close_connection();
    }
}

async function delete_test_user() {
    db.open_connection(config.TEST_DB_URI, process.env.API_TEST);

    try {
        let customer = await Customer.findOneAndDelete({_id: TEST_USER.user_id});
        console.log(`NOTICE: Deleted ${customer}`);
    } catch(err) {
        console.error(`ERROR: ${err}`);
    } finally {
        db.close_connection();
    }

}

// async function create_test_account() {
//     // Instantiate server to allow adding user
//     let app = require('../app');
//     let server = await app.create();
//
//     // server.then(() => {
//     //     return new Promise(resolve => {
//     //         resolve(add_test_user());
//     //     })
//     // }).then(() => {
//     //     app.close(server);
//     // });
//     await app.close(server);
// }

// async function delete_test_account() {
//     return new Promise((resolve, reject) => {
//         Customer.findOneAndDelete({_id: TEST_USER.user_id}, err => {
//             if(err) {
//                 // Meh...
//                 reject(err);
//             } else {
//                 resolve();
//             }
//         });
//     });
// }

// async function delete_test_account() {
//     let app = require('../app');
//     let server = await app.create();
//
//     try {
//         await Customer.findOneAndDelete({_id: TEST_USER.user_id});
//     } catch(err) {
//         console.error(err);
//     }
//
//     await app.close(server);
// }

// async function delete_test_account() {
//     describe('Account: Remove', async function() {
//         var server;
//         beforeEach("Instantiate server", () => {
//             server = require('../app').server;
//         });
//
//         afterEach("Tear down server", () => {
//             require('../app').stop();
//         });
//
//         it('Remove: should remove the user-account', function(done) {
//             chai.request(server).delete(`/api/v1/account/`)
//                 .set('x-access-token', TEST_USER.token)
//                 .end(function(err, res) {
//                     res.should.have.status(200);
//                     res.body.should.be.a('object');
//                     // noinspection BadExpressionStatementJS
//                     expect(res).to.be.json;
//
//                     ["success", "message", "error"].forEach(val => {
//                         res.body.should.have.a.property(val);
//                     });
//                     res.body.success.should.be.eql(true);
//                     done();
//                 });
//         });
//     });
// }

// try {
//     let prom = create_test_account();
//     // let prom2 = delete_test_account();
// } catch(err) {
//     console.error(err);
// }

// add_test_user();
// setTimeout(() => {
//     delete_test_user();
// }, 2000);

module.exports = {
    add_test_user,
    delete_test_user,
    TEST_USER,
    TEST_USER_CREDENS
};
