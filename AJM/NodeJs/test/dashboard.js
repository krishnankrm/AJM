const chai = require("chai");
const chaihttp = require("chai-http");
const server = require("../dist/app");
chai.use(require('chai-json-schema'));

chai.should();
chai.use(chaihttp);

    describe("Dashboard Calls", () => {
        it("Mixer", (done) => {
            chai.request(server)
                .get("/dashboard/MixerStatus")
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('status');
                    response.body.should.have.property('time');
                    response.body.should.have.property('status');
                    var expect = chai.expect;
                    // expect(response.body.status).to.equal(true);
                    expect(response.body.status).to.be.a('boolean');
                    expect(response.body.time).to.include('T');
                    expect(response.body.time).to.be.a('string');
                    done();
                })
        })
        it("Hatch", (done) => {
            chai.request(server)
                .get("/dashboard/HatchStatus")
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('status');
                    response.body.should.have.property('time');
                    response.body.should.have.property('status');
                    var expect = chai.expect;
                    // expect(response.body.status).to.equal(true);
                    expect(response.body.status).to.be.a('boolean');
                    expect(response.body.time).to.include('T');
                    expect(response.body.time).to.be.a('string');
                    done();
                })
        })
        it("Lever", (done) => {
            chai.request(server)
                .get("/dashboard/LeverStatus")
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('status');
                    response.body.should.have.property('time');
                    response.body.should.have.property('status');
                    var expect = chai.expect;
                    // expect(response.body.status).to.equal(true);
                    expect(response.body.time).to.be.a('string');
                    expect(response.body.status).to.be.a('boolean');
                    expect(response.body.time).to.include('T');
                    done();
                })
        })
        it("rpm2", (done) => {
            chai.request(server)
                .get("/dashboard/rpm2")
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('val');
                    var expect = chai.expect;
                    // expect(response.body.status).to.equal(true);
                    expect(response.body.val).to.be.a('number');

                    done();
                })
        })
        it("rpm1", (done) => {
            chai.request(server)
                .get("/dashboard/rpm1")
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('val');
                    var expect = chai.expect;
                    // expect(response.body.status).to.equal(true);
                    expect(response.body.val).to.be.a('number');

                    done();
                })
        })
        it("TodaysCycleCount", (done) => {
            chai.request(server)
                .get("/dashboard/TodaysCycleCount")
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('count');
                    var expect = chai.expect;
                    expect(response.body.count).to.be.a('number');
                    expect(response.body.count).to.be.above(0);

                    done();
                })
        })
        it("TodayOnTimeTotal", (done) => {
            chai.request(server)
                .get("/dashboard/TodayOnTimeTotal")
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('TodaysRunningTime');
                    var expect = chai.expect;
                    expect(response.body.TodaysRunningTime).to.be.a('string');
                    expect(response.body.TodaysRunningTime).to.include(':');
                    done();
                })
        })
        let productSchema = {
            title: 'productSchema',
            type: 'object',
            required: ['hour', 'Energy'],
            properties: {
            hour: {
                type: 'number',
              },
            Energy: {
                type: 'string'
              }
            }
          };
        
        it("energyGraph", (done) => {
            chai.request(server)
                .get("/dashboard/energyGraph")
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('array');
                    var expect = chai.expect;                    
                    response.body.forEach(product => expect(product).to.be.jsonSchema(productSchema));
                    done();
                })
        })
    })

