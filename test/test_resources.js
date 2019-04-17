"use strict";

process.env.test = true;

const chai = require("chai");
const should = chai.should();
const sinon = require("sinon");
const request = require("request");

const base_url = `http://localhost:8080`;

const resource_controller = require("../api/controllers/resource_controller");

describe("Resources", function() {
    describe("Stubbed resources", function() {
        beforeEach(() => {
            this.get = sinon.stub(request, "get");
        });
        afterEach(() => {
            request.restore();
        });
    });

    it("Should return all of the resources", function (done) {
        let req = {};

        let res = {
            json: sinon.spy(),
        };

        resource_controller.get_resources_by_customer_id(req, res);
        console.log(res.json());
        done();
    })
});


