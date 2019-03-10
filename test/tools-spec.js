const {expect} = require("chai");
const tools = require('../lib/tools');

const assert = require('assert');
const request = require('supertest');
const app = require('../index')



describe("printname()",() => {
    it("should print the last name first", () => {
        let results = tools.printName({first: "Alex", last: "Banks"});

        expect(results).to.equal("Banks, Alex");
    });
}) 

describe('Unit testing the / route', function() {

    it('should return OK status', function() {
      return request(app)
        .get('/passwordrecover')
        .then(function(response){
            assert.equal(response.status, 200)
        })
    });

});