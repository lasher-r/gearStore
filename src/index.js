const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())

// Connect to MongoDB database
mongoose.connect('mongodb://localhost:27017/gear', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const GearRoute = require('./routes/gear')
app.use('/gear', GearRoute)

const PackRoute = require('./routes/packs')
app.use('/packs', PackRoute)

app.listen(5000, () => {
    console.log('Server has started!')
})

module.exports = app
