"use strict";

let chai = require('chai');
let chai_http = require('chai-http');
// let request = require('request');

let should = chai.should();
let expect = chai.expect;

chai.use(chai_http);

describe('Customer Authentication', function() {
    const CUSTOMER_PAYLOAD  = {
        firstname: "Bertha",
        lastname: "deblues",
        emailid: "bertha.deblues@jazzy.com",
        password: "aVerySecurePassword",
    };

    let server;
    beforeEach("Instantiate server", async () => {
        server = require('../app').server;
    });

    afterEach("Close server", async () => {
        require('../app').stop();
    });

    describe('Proper Account Management', function(done) {
        it('should add a new user account', function(done) {
            chai.request(server).post('/api/v1/account')
                .send(CUSTOMER_PAYLOAD)
                .end(function(err, res) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                // noinspection BadExpressionStatementJS
                expect(res).to.be.json;

                ["success", "message", "error"].forEach(val => {
                    res.body.should.have.a.property(val);
                });
                res.body.success.should.be.eql(true);
                // expect(res.body.error).to.be.null();
                done();
            });
        });

        it('should get the customers unique `_id` given when provided a unique email address', function(done) {
            chai.request(server).get(`/api/v1/account/${CUSTOMER_PAYLOAD.emailid}`)
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    // noinspection BadExpressionStatementJS
                    expect(res).to.be.json;

                    ["success", "message", "error"].forEach(val => {
                        res.body.should.have.a.property(val);
                    });
                    res.body.should.have.a.property('CustomerId');
                    // expect(res.body.error).to.be.null();
                    res.body.success.should.be.eql(true);
                    CUSTOMER_PAYLOAD.customer_id = res.body.CustomerId;
                    done();
                })
        });

        it('should remove the customer by their unique `_id` attribute', function(done) {
            chai.request(server).delete(`/api/v1/account/${CUSTOMER_PAYLOAD.customer_id}`)
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

    describe('Improper Account Management', function() {
        //TODO: set this up to use before and after hooks instead of describe scenarios
        describe('set up db for checking duplicate errors', function() {
            it('should create a new user account', function (done) {
                chai.request(server).post('/api/v1/account')
                    .send(CUSTOMER_PAYLOAD)
                    .end(function(err, res) {
                        res.should.have.status(200);
                        res.body.success.should.be.eql(true);
                        done();
                    });
            });
            it('should fetch the unique id for the customer', function(done) {
                chai.request(server).get(`/api/v1/account/${CUSTOMER_PAYLOAD.emailid}`)
                    .end(function(err, res) {
                        res.should.have.status(200);
                        res.body.success.should.be.eql(true);
                        CUSTOMER_PAYLOAD.customer_id = res.body.CustomerId;
                        done();
                    })

            });
        });

        describe('verify failures', function() {
            it('should fail to add the same user account', function(done) {
                chai.request(server).post('/api/v1/account').send(CUSTOMER_PAYLOAD)
                    .end(function(err, res) {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        // noinspection BadExpressionStatementJS
                        expect(res).to.be.json;

                        ["success", "message", "error"].forEach(val => {
                            res.body.should.have.a.property(val);
                        });
                        res.body.success.should.be.eql(false);
                        // expect(res.body.error).to.be.null();
                        res.body.error.code.should.be.eql(11000);
                        done();
                    });
            });

            it('should not get any customer information when provided a fake email address', function(done) {
                chai.request(server).get(`/api/v1/account/not@real.com`)
                    .end(function(err, res) {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        // noinspection BadExpressionStatementJS
                        expect(res).to.be.json;

                        ["success", "message", "error"].forEach(val => {
                            res.body.should.have.a.property(val);
                        });
                        res.body.should.have.a.property('CustomerId');
                        console.log(res.body.error);
                        // expect(res.body.error).to.be.null();
                        res.body.success.should.be.eql(false);
                        done();
                    });
            });

            it('should remove the customer by their unique `_id` successfully', function(done) {
                chai.request(server)
                    .delete(`/api/v1/account/${CUSTOMER_PAYLOAD.customer_id}`)
                    .end(function(err, res) {
                        res.should.have.status(200);
                        res.body.success.should.be.eql(true);
                        done();
                    });
            });

            it('should remove the customer by their unique `_id` unsuccessfully', function(done) {
                chai.request(server)
                    .delete(`/api/v1/account/${CUSTOMER_PAYLOAD.customer_id}`)
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
    });
});

// TODO
// describe('/POST Resources', function() {
//     it('it should add a Resources', function(done) {
//         chai.request(baseUrl)
//           .post('api/v1/resources/' + customer_id )
//           .send({
//             "ip_address": "10.364.235.668", // should be unique
//             "ram": 4,
//             "cores": 2,
//             "cpus": 2,
//             "gpus": 1,
//             "price": 10,
//             "machine_name": "the description of this machine"
//           })
//           .end(function(error, response, body) {
//                     //expect(response.statusCode).to.equal(200);
//                     console.log(body);
//                 done();
//           });
//     });
// });
//
// describe('/GET Resources', function() {
//     it('it should GET all the resources', function(done) {
//         request.get({ url: baseUrl + 'api/v1/resources' },
//             function(error, response, body) {
//                 //var bodyObj = JSON.parse(body);
//                 //expect(bodyObj.cpus).to.equal("2");
//                 //expect(bodyObj.price).to.equal("10");
//                     expect(response.statusCode).to.equal(200);
//                     console.log(body);
//                 done();
//             });
//     });
// });
//
// var customer_id ="5ac11ae51327c262728790cb"
//
// describe('/GET Resources one', function() {
//     it('it should GET all the resources with a customer_id', function(done) {
//         request.get({ url: baseUrl + 'api/v1/resources/' + customer_id },
//             function(error, response, body) {
//                 //var bodyObj = JSON.parse(body);
//                 //expect(bodyObj.cpus).to.equal("2");
//                 //expect(bodyObj.price).to.equal("10");
//                     expect(response.statusCode).to.equal(200);
//                     console.log(body);
//                 done();
//             });
//     });
// });
//
//
//
// describe('/POST Customers', function() {
//     it('it should add a customer', function(done) {
//         chai.request(baseUrl)
//           .post('api/v1/account')
//           .send({
//             "firstname":"soyoung","lastname":"kim","emailid":"sy6@pdx.edu", "password":"abcd123"
//           }) //emailid should be unique
//           .end(function(error, response, body) {
//                     //expect(response.statusCode).to.equal(200);
//                     console.log(body);
//                 done();
//           });
//     });
// });
//
// describe('/GET Customers', function() {
//     it('it should GET the customers with email id: sy6@pdx.edu', function(done) {
//         request.get({ url: baseUrl + 'api/v1/account/sy6@pdx.edu' },
//             function(error, response, body) {
//                     expect(response.statusCode).to.equal(200);
//                     console.log(body);
//                 done();
//             });
//     });
// });
//
// describe('/POST Jobs', function() {
//     it('it should add a Job', function(done) {
//         chai.request(baseUrl)
//           .post('api/v1/jobs')
//           .send({
//             "source_files": [
//                 "1.js"
//             ],
//             "input_files": [
//                 "2.js"
//             ],
//             "resources": [
//                 {
//                     "resourceId": "5abab56ee538724ad170b523",
//                     "resourcePrice": 10
//                 },
//                 {
//                     "resourceId": "5abab76ee538724ad170b523",
//                     "resourcePrice": 15
//                 }
//             ],
//             "workers": "2",
//             "cores": "3",
//             "memory": "100",
//             "status": "Online",
//             "customerId": "5abab56ee538724ad170b523",
//             "createdBy": "5abab56ee538724ad170b523",
//             "updatedBy": "5abab56ee538724ad170b523"
//           })
//           .end(function(error, response, body) {
//                     //expect(response.statusCode).to.equal(200);
//                     console.log(body);
//                 done();
//           });
//     });
// });
//
// describe('/GET Jobs', function() {
//     it('it should GET all the jobs', function(done) {
//         request.get({ url: baseUrl + 'api/v1/jobs' },
//             function(error, response, body) {
//                     expect(response.statusCode).to.equal(200);
//                     console.log(body);
//                 done();
//             });
//     });
// });
//
// customer_id = "5abab56ee538724ad170b523"
// describe('/GET Jobs by customer_id', function() {
//     it('it should GET the jobs with a customer_id', function(done) {
//         request.get({ url: baseUrl + 'api/v1/jobs/' + customer_id},
//             function(error, response, body) {
//                     expect(response.statusCode).to.equal(200);
//                     console.log(body);
//                 done();
//             });
//     });
// });



/*
let mongoose = require("mongoose");
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
//let server = require('http://localhost:3000/');
//var should = require("should");
var expect = require("chai").expect;

chai.use(chaiHttp);

describe('/GET Resources', () => {
      it('it should GET all the resources', (done) => {
            chai.request(server)
            .get('api/v1/resources')
            .end((err, res, body) => {
                //res.should.have.status(200);
                //res.body.length.should.be.eql(0);
                //expect(res.statusCode).to.equal(200);
                console.log(body);
              done();
            });
      });
  });
*/

/*  describe('/POST book', () => {
      it('it should not POST a book without pages field', (done) => {
        let book = {
            title: "The Lord of the Rings",
            author: "J.R.R. Tolkien",
            year: 1954
        }
            chai.request(server)
            .post('/book')
            .send(book)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                res.body.errors.should.have.property('pages');
                res.body.errors.pages.should.have.property('kind').eql('required');
              done();
            });
      });
      it('it should POST a book ', (done) => {
        let book = {
            title: "The Lord of the Rings",
            author: "J.R.R. Tolkien",
            year: 1954,
            pages: 1170
        }
            chai.request(server)
            .post('/book')
            .send(book)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Book successfully added!');
                res.body.book.should.have.property('title');
                res.body.book.should.have.property('author');
                res.body.book.should.have.property('pages');
                res.body.book.should.have.property('year');
              done();
            });
      });
  });
 /*
  * Test the /GET/:id route
  */
 /* describe('/GET/:id book', () => {
      it('it should GET a book by the given id', (done) => {
        let book = new Book({ title: "The Lord of the Rings", author: "J.R.R. Tolkien", year: 1954, pages: 1170 });
        book.save((err, book) => {
            chai.request(server)
            .get('/book/' + book.id)
            .send(book)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('title');
                res.body.should.have.property('author');
                res.body.should.have.property('pages');
                res.body.should.have.property('year');
                res.body.should.have.property('_id').eql(book.id);
              done();
            });
        });

      });
  });*/