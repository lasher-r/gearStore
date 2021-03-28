const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const Pack = require('../models/pack')
const Gear = require('../models/gear')

router.post('/', async (req, res) => {
    try {
        const gearIds = req.body.gear.map(mongoose.Types.ObjectId)
        let gearItems = await Gear.find({ _id: { $in: gearIds } }).exec()
        gearItems = gearItems.map((x) => x.toObject())
        const weight = gearItems.reduce((a, c) => a + c.weight, 0)
        const data = { weight, ...req.body }
        const item = new Pack(data)
        await item.save()
        res.send(item)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get('/', async (req, res) => {
    try {
        const packs = await Pack.find({}).populate('gear')
        res.json(packs)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get('/:id', async (req, res) => {
    const item = await Pack.findOne({ _id: req.params.id }).populate('gear')
    res.send(item)
})

module.exports = router
