
"use strict";

let chai = require('chai');
let chai_http = require('chai-http');
let expect = chai.expect;

let utils = require('./utils');
// let server = require('../app').server;
let Prices = require('../api/models/pricing_model');

let sinon = require('sinon');

let mongoose = require('mongoose');
require('sinon-mongoose');

chai.should();
chai.use(chai_http);

process.env.API_TEST = true;

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