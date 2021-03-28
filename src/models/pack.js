const mongoose = require('mongoose')

const gear = require('./gear')

const gearRef = process.env.NODE_ENV == 'test' ? 'test-gear' : 'gear'

const gearSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
        default: 'default',
    },
    weight: {
        type: Number,
        required: true,
    },
    gear: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: gearRef,
    },
})

const collection = process.env.NODE_ENV == 'test' ? 'test-pack' : 'pack'

module.exports = mongoose.model(collection, gearSchema)
