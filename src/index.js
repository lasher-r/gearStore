const express = require('express')
const mongoose = require('mongoose')

// Connect to MongoDB database
mongoose
    .connect('mongodb://localhost:27017/gear', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        const app = express()

        app.listen(5000, () => {
            console.log('Server has started!')
        })
    })
