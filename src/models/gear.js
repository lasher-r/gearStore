const mongoose = require('mongoose')

const gearSchema = mongoose.Schema({
    name: String,
    description: String,
    category: String,
    weight: Number,
    qty: Number,
})

module.exports = mongoose.model(`${process.env.NODE_ENV}Gear`, gearSchema)
