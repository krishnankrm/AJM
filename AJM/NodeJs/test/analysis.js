const chai = require("chai");
const chaihttp = require("chai-http");
const server = require("../dist/app");
chai.use(require('chai-json-schema'));
var expect = chai.expect;

chai.should();
chai.use(chaihttp);

describe("Analysis Calls", () => {
    var stop=new Date()
    var start=new Date()
    start.setHours(start.getHours()+5)
    start.setMinutes(start.getMinutes()+30)
    stop.setHours(stop.getHours()+5)
    stop.setMinutes(stop.getMinutes()+30)
    start.setDate(start.getDate()-1)
    it("Mixer", (done) => {
        chai.request(server)
            .post("/analysis/MixerOnOffTime")
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                "start" :start.toISOString().slice(0,16),
                "stop" : stop.toISOString().slice(0,16)
            })    
            .end((err, response) => {
                response.should.have.status(200);
                response.body.should.be.a('object');
                response.body.should.have.property('Ontime');
                response.body.should.have.property('OFF_time');
                
                response.body.Ontime.should.be.a('string');
                response.body.Ontime.should.include(":");                
                response.body.OFF_time.should.be.a('string');
                response.body.OFF_time.should.include(":");
                done();
            })
    })
    it("Latch", (done) => {
        chai.request(server)
            .post("/analysis/LatchOnOfftime")
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                "start" :start.toISOString().slice(0,16),
                "stop" : stop.toISOString().slice(0,16)
            })    
            .end((err, response) => {
                response.should.have.status(200);
                response.body.should.be.a('object');
                response.body.should.have.property('Ontime');
                response.body.should.have.property('OFF_time');
                expect(response.body.Ontime).to.include(':');
                expect(response.body.Ontime).to.be.a('string');
                expect(response.body.OFF_time).to.include(':');
                expect(response.body.OFF_time).to.be.a('string');
                done();
            })
    })
    it("Hatch", (done) => {
        chai.request(server)
            .post("/analysis/HatchOnOfftime")
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                "start" :start.toISOString().slice(0,16),
                "stop" : stop.toISOString().slice(0,16)
            })    
            .end((err, response) => {
                response.should.have.status(200);
                response.body.should.be.a('object');
                response.body.should.have.property('Ontime');
                response.body.should.have.property('OFF_time');
                expect(response.body.Ontime).to.include(':');
                expect(response.body.Ontime).to.be.a('string');
                expect(response.body.OFF_time).to.include(':');
                expect(response.body.OFF_time).to.be.a('string');
                done();
            })
    })
    it("Total Cycle Count", (done) => {
        chai.request(server)
            .post("/analysis/TotalCycleCount")
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                "start" :start.toISOString().slice(0,16),
                "stop" : stop.toISOString().slice(0,16)
            })    
            .end((err, response) => {
                response.should.have.status(200);
                response.body.should.be.a('object');
                response.body.should.have.property('count');
                expect(response.body.count).to.be.a('number');
                expect(response.body.count).to.be.above(0);
                done();
            })
    })
    it("Rpm Rotor 1", (done) => {
        chai.request(server)
            .post("/analysis/RPM1")
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                "start" :start.toISOString().slice(0,16),
                "stop" : stop.toISOString().slice(0,16)
            })    
            .end((err, response) => {
                response.should.have.status(200);
                response.body.should.be.a('object');
                response.body.should.have.property('max');
                response.body.should.have.property('min');
                response.body.should.have.property('avg');

                expect(response.body.max).to.be.a('number');
                expect(response.body.max).to.be.above(0);                
                expect(response.body.min).to.be.a('number');
                expect(response.body.min).to.be.above(-1);                
                expect(response.body.avg).to.be.a('number');
                expect(response.body.avg).to.be.above(0);
                done();
            })
    })
    it("Rpm Rotor 2", (done) => {
        chai.request(server)
            .post("/analysis/RPM2")
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                "start" :start.toISOString().slice(0,16),
                "stop" : stop.toISOString().slice(0,16)
            })    
            .end((err, response) => {
                response.should.have.status(200);
                response.body.should.be.a('object');
                response.body.should.have.property('max');
                response.body.should.have.property('min');
                response.body.should.have.property('avg');

                expect(response.body.max).to.be.a('number');
                expect(response.body.max).to.be.above(0);                
                expect(response.body.min).to.be.a('number');
                expect(response.body.min).to.be.above(-1);                
                expect(response.body.avg).to.be.a('number');
                expect(response.body.avg).to.be.above(0);
                done();
            })
    })
    let productSchema = {
        title: 'productSchema',
        type: 'object',
        required: ['time', 'Energy'],
        properties: {
        time: {
            type: 'string',
          },
        Energy: {
            type: 'string'
          }
        }
      };
    
    it("Energy Consumption", (done) => {
        chai.request(server)
            .post("/analysis/energyGraph")
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                "start" :start.toISOString().slice(0,16),
                "stop" : stop.toISOString().slice(0,16)
            })    
            .end((err, response) => {
                response.should.have.status(200);
                response.body.should.be.a('array');
                response.body.forEach(product => expect(product).to.be.jsonSchema(productSchema));
                done();
            })
    })
    
})
