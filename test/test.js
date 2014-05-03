var should = require('should');
var assert = require('assert');
var request = require('supertest');
var config = require('../config');

describe('Routing', function() {
    var url = 'http://'+config.app.ip+':'+config.app.port;
    before(function(done) {
        done();
    });
    describe('Get coordinates', function() {
        it('Should return valid JSON', function(done) {

            request(url).get('/places/4326/180/66.17202284017034/-180/-81.38338283894844').end(function(err, res) {
                if (err) {
                    throw err;
                }
                res.should.have.status(200);
                res.body.should.have.property('response');
                res.body.response.length.should.not.equal(0);
                done();
            });
        });
        it('Should return 0 records', function(done) {

            request(url).get('/places/4326/0/0/0/0').end(function(err, res) {
                if (err) {
                    throw err;
                }
                res.should.have.status(200);
                res.body.should.have.property('response');
                res.body.response.length.should.equal(0);
                done();
            });
        });
    });
});
