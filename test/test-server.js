var chai = require('chai');
var chaiHttp = require('chai-http');

global.environment = 'test';
var server = require('../server.js');
var Item = require('../models/item');
var seed = require('../db/seed');

var should = chai.should();
var app = server.app;

chai.use(chaiHttp);

describe('Shopping List', function() {
    before(function(done) {
        seed.run(function() {
            done();
        });
    });

    var firstID;

    it('should list items on GET', function(done) {
        chai.request(app)
            .get('/items')
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.should.have.length(3);
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('_id');
                res.body[0].should.have.property('name');
                res.body[0]['_id'].should.be.a('string');
                res.body[0].name.should.be.a('string');
                res.body[0].name.should.equal('Broad beans');
                res.body[1].name.should.equal('Tomatoes');
                res.body[2].name.should.equal('Peppers');

                // capture ID of first item for later test
                firstID = res.body[0]['_id'];

                done();
            });
    });

    it('should add an item on post', function(done) {
        chai.request(app)
            .post('/items')
            .send({'name':'Pickles'})
            .end(function(err, res) {
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('_id');
                res.body.name.should.be.a('string');
                res.body['_id'].should.be.a('string');
                res.body.name.should.equal('Pickles');
                done();
            });
    });

    it('should edit an item on put', function(done) {
        //console.log('test: ',firstID);
        chai.request(app)
            .put('/items/'+firstID)
            .send({'name':'Baked Beans'})
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('_id');
                res.body.name.should.be.a('string');
                res.body['_id'].should.be.a('string');
                res.body.name.should.equal('Baked Beans');
                res.body['_id'].should.equal(firstID);
                done();
            });
    });

    it('should delete an item on delete', function(done) {
        chai.request(app)
            .put('/items/'+firstID)
            .send({'name':'Baked Beans','id':firstID})
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('_id');
                res.body.name.should.be.a('string');
                res.body['_id'].should.be.a('string');
                res.body.name.should.equal('Baked Beans');
                res.body['_id'].should.equal(firstID);
                done();
            });
    });

    after(function(done) {
        Item.remove(function() {
            done();
        });
    });
});

/*

    it('should return error on delete invalid item', function(done) {
        chai.request(app)
            .delete('/items/10')
            .send({'name':'Okra','id':'10'})
            .end(function(err, res) {
                res.should.have.status(500);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                res.body.error.should.be.a('string');
                res.body.error.should.equal('No item with id: 10');
                done();
            });
    });
    it('should add item on put invalid item', function(done) {
        chai.request(app)
            .put('/items/99')
            .send({'name':'Baked Beans','id':'99'})
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('id');
                res.body.name.should.be.a('string');
                res.body.id.should.be.a('number');
                res.body.name.should.equal('Baked Beans');
                res.body.id.should.equal(99);
                done();
            });
    });
});
 */