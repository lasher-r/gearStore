const express = require('express')
const router = express.Router()

const Gear = require('../models/gear')

router.post('/', async (req, res) => {
    const item = new Gear(req.body)
    await item.save()
    res.send(item)
})

module.exports = router
