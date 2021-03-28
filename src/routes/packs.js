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

router.patch('/:id', async (req, res) => {
    const item = await Pack.findOne({ _id: req.params.id })
    for (const key in req.body) {
        item[key] = req.body[key]
    }
    await item.save()
    res.send(item)
})

router.delete('/:id', async (req, res) => {
    try {
        await Pack.deleteOne({ _id: req.params.id })
        res.status(204).send()
    } catch {
        res.status(404)
        res.send({ error: "Item doesn't exist!" })
    }
})

module.exports = router
