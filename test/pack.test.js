process.env.NODE_ENV = 'test'

const chai = require('chai')
const { expect } = require('chai')
const chaiHttp = require('chai-http')
const server = require('../src/index')
const should = chai.should()

const Gear = require('../src/models/gear')
const Pack = require('../src/models/pack')

chai.use(chaiHttp)

describe('PACK', () => {
    const gearData = [
        {
            name: 'tent',
            description: 'an orange tent',
            category: 'Big 3',
            weight: 36,
            qty: 1,
        },
        {
            name: 'pack',
            description: 'a blue pack',
            category: 'Big 3',
            weight: 15,
            qty: 1,
        },
        {
            name: 'sleeping bag',
            description: 'a red sleeping bag',
            category: 'Big 3',
            weight: 36,
            qty: 1,
        },
    ]

    const packs = [
        {
            name: 'trip 1',
            description: 'What I packed for trip1',
            category: 'backpacking',
        },
        {
            name: 'trip 2',
            description: 'What I packed for trip2',
            category: 'backpacking',
        },
        {
            name: 'trip 3',
            description: 'What I packed for trip3',
            category: 'hiking',
        },
    ]

    afterEach((done) => {
        Pack.deleteMany({}, () => Gear.deleteMany({}, () => done()))
    })

    it('saves a pack', (done) => {
        Gear.create(gearData)
            .then((savedGear) => {
                const p = { ...packs[0] }
                p.gear = savedGear.map((x) => x._id)
                chai.request(server)
                    .post('/packs')
                    .send(p)
                    .end((err, res) => {
                        if (err) {
                            done(err)
                        }
                        res.should.have.status(200)
                        res.body.should.be.an('Object')

                        Pack.find({})
                            .then((docs) => {
                                docs.should.be.an('Array').of.length(1)
                                done()
                            })
                            .catch((e) => {
                                done(e)
                            })
                    })
            })
            .catch(done)
    })
})
