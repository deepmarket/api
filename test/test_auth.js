"use strict";

let chai = require('chai');
let chai_http = require('chai-http');
let expect = chai.expect;

chai.should();
chai.use(chai_http);

process.env.test = true;

describe("Customer Authentication", function() {
    it("should allow the user to login", function(done) {
        done();
    });
    it("should allow the user the logout", function(done) {
        done();
    });
});