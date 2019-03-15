
"use strict";

let chai = require('chai');
let chai_http = require('chai-http');
let expect = chai.expect;
let request = require("request");

let utils = require('./utils');
// let server = require('../app').server;
let Prices = require('../api/models/pricing_model');
let price_controller = require("../api/controllers/pricing_controller");

let sinon = require('sinon');

let mongoose = require('mongoose');
require('sinon-mongoose');

chai.should();
chai.use(chai_http);

process.env.API_TEST = true;

const base = 'http://localhost:8080';

describe("Get All Prices", function() {
    it("should return all of the prices for the next 24 hours", function(done) {
        let prices_mock = sinon.mock(Prices);
        let expected = {status: true, prices: []};

        prices_mock.expects('find').yields(null, expected);

        Prices.find(function (err, result) {
            prices_mock.verify();
            prices_mock.restore();
            expect(result.status).to.be.true;
            done();
        });
    });

    // Test will pass if we fail to get prices
    it("should return error", function(done) {
        let prices_mock = sinon.mock(Prices);
        let expected = {status: false, error: "Something went wrong"};

        prices_mock.expects('find').yields(expected, null);

        Prices.find(function (err, result) {
            prices_mock.verify();
            prices_mock.restore();
            expect(err.status).to.not.be.true;
            done();
        });
    });
});

describe('GET /pricing', () => {
    it('should return prices for the day', (done) => {
        request.get(`${base}/api/v1/pricing`, (err, res, body) => {
            res.statusCode.should.eql(200);

            res.headers['content-type'].should.contain('application/json');

            body = JSON.parse(body);

            body.success.should.eql(true);

            body.data.length.should.eql(4);

            // body.data[0].should.include.keys(
            //     null
            // );

            // body.data[0].name.should.eql(null);
            done();
        });
    });
});



// describe("getIndexPage", function() {
//
//     describe('when not stubbed', () => {
//         // test cases
//     });
//
//     describe('when stubbed', () => {
//         beforeEach(() => {
//             this.get = sinon.stub(request, 'get');
//         });
//         afterEach(() => {
//             request.restore();
//         });
//         // test cases
//     });
//
//     it("should return index page", function() {
//         let req = {};
//
//         let res = {
//             status: sinon.spy()
//         };
//
//         price_controller.get_prices(req, res);
//         // let's see what we get on res.send
//         console.log(res.status);
//     });
// });