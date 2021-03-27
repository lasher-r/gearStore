const mongoose = require('mongoose')

const gearSchema = mongoose.Schema({
    name: String,
    description: String,
    category: String,
    weight: Number,
    qty: Number,
})

const collection = process.env.NODE_ENV == 'test' ? 'test-gear' : 'gear'

module.exports = mongoose.model(collection, gearSchema)
