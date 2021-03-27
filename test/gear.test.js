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

    const post = (data) => {
        return new Promise((resolve, reject) => {
            chai.request(server)
                .post('/gear')
                .send(data)
                .end((err, res) => {
                    if (err) {
                        reject(err)
                    }
                    if (res.status != 200) {
                        reject(new Error(res.status))
                    }
                    resolve(res.body)
                })
        })
    }

    it('gets all gear', (done) => {
        data = [
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
        Promise.all(data.map(post))
            .then((_) => {
                chai.request(server)
                    .get('/gear')
                    .end((err, res) => {
                        if (err) {
                            done(err)
                        }
                        res.should.have.status(200)
                        res.body.should.be.an('Array').of.length(data.length)
                        done()
                    })
            })
            .catch(done)
    })

    it('gets one gear item', (done)=>{
        data = {
            name: 'tent',
            description: 'an orange tent',
            category: 'Big 3',
            weight: 36,
            qty: 1,
        }

        post(data).then((saved)=>{
            chai.request(server)
                    .get(`/gear/${saved._id}`)
                    .end((err, res) => {
                        if (err) {
                            done(err)
                        }
                        res.should.have.status(200)
                        res.body.should.be.an('Object')
                        res.body.should.eql(saved)
                        done()
                    })
        }).catch(done)
    })
})
