process.env.NODE_ENV = 'test'

const chai = require('chai')
const { expect } = require('chai')
const chaiHttp = require('chai-http')
const server = require('../src/index')
const should = chai.should()

const gear = require('../src/models/gear')

chai.use(chaiHttp)

describe('GEAR', () => {
    afterEach((done) => {
        gear.deleteMany({}, () => done())
    })

    it('Creates a new gear item', (done) => {
        const data = {
            name: 'tent',
            description: 'an orange tent',
            category: 'Big 3',
            weight: 36,
            qty: 1,
        }
        chai.request(server)
            .post('/gear')
            .send(data)
            .end((err, res) => {
                if (err) {
                    done(err)
                }
                res.should.have.status(200)
                res.body.should.be.an('Object')

                gear.find({})
                    .then((docs) => {
                        docs.should.be.an('Array').of.length(1)
                        done()
                    })
                    .catch((e) => {
                        done(e)
                    })
            })
    })
})
