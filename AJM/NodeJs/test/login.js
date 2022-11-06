const chai = require("chai");
const chaihttp = require("chai-http");
const server = require("../dist/app");
chai.use(require('chai-json-schema'));

chai.should();
chai.use(chaihttp);

    describe("User Authentication", () => {
        it("login", (done) => {
            chai.request(server)
                .post("/login")
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({"username":"admin","password":"admin"})    
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message');
                    response.body.message.should.be.a('string');
                    response.body.message.should.equal("Success Login");
                    done();
                })
        })
    })

