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

    const post = (data) => {
        return new Promise((resolve, reject) => {
            Gear.create(gearData)
                .then((savedGear) => {
                    data.gear = savedGear.map((x) => x._id)
                    chai.request(server)
                        .post('/packs')
                        .send(data)
                        .end((err, res) => {
                            if (err) {
                                reject(err)
                            }
                            resolve(res.body)
                        })
                })
                .catch(reject)
        })
    }

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

    it('returns all packs', (done) => {
        Promise.all(packs.map(post))
            .then((_) => {
                chai.request(server)
                    .get('/packs')
                    .end((err, res) => {
                        if (err) {
                            done(err)
                        }
                        res.should.have.status(200)
                        res.body.should.be.an('Array').of.length(packs.length)
                        res.body[0].should.have
                            .property('gear')
                            .of.length(gearData.length)

                        res.body[0].gear[0].should.have
                            .property('name')
                            .eql(gearData[0].name)
                        res.body[0].gear[0].should.have
                            .property('description')
                            .eql(gearData[0].description)
                        res.body[0].gear[0].should.have
                            .property('category')
                            .eql(gearData[0].category)
                        res.body[0].gear[0].should.have
                            .property('weight')
                            .eql(gearData[0].weight)
                        res.body[0].gear[0].should.have
                            .property('qty')
                            .eql(gearData[0].qty)
                        done()
                    })
            })
            .catch(done)
    })

    it('gets a pack', (done) => {
        post(packs[0])
            .then((savedPack) => {
                chai.request(server)
                    .get(`/packs/${savedPack._id}`)
                    .end((err, res) => {
                        if (err) {
                            done(err)
                        }
                        res.should.have.status(200)
                        res.body.should.be.an('Object')

                        res.body.should.have
                            .property('gear')
                            .of.length(gearData.length)

                        res.body.gear[0].should.have
                            .property('name')
                            .eql(gearData[0].name)
                        res.body.gear[0].should.have
                            .property('description')
                            .eql(gearData[0].description)
                        res.body.gear[0].should.have
                            .property('category')
                            .eql(gearData[0].category)
                        res.body.gear[0].should.have
                            .property('weight')
                            .eql(gearData[0].weight)
                        res.body.gear[0].should.have
                            .property('qty')
                            .eql(gearData[0].qty)

                        res.body.should.have
                            .property('name')
                            .eql(savedPack.name)
                        res.body.should.have
                            .property('description')
                            .eql(savedPack.description)
                        res.body.should.have
                            .property('category')
                            .eql(savedPack.category)
                        res.body.should.have.property('weight')
                        done()
                    })
            })
            .catch(done)
    })
})
