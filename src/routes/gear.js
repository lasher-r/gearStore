const express = require('express')
const router = express.Router()

const Gear = require('../models/gear')

router.post('/', async (req, res) => {
    const item = new Gear(req.body)
    await item.save()
    res.send(item)
})

router.get('/', async (req, res) => {
    try {
        const gear = await Gear.find({})
        res.json(gear)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get('/:id', async (req, res) => {
    const item = await Gear.findOne({ _id: req.params.id })
    res.send(item)
})

router.patch('/:id', async (req, res) => {
    const item = await Gear.findOne({ _id: req.params.id })
    for (const key in req.body) {
        item[key] = req.body[key]
    }
    await item.save()
    res.send(item)
})

router.delete('/:id', async (req, res) => {
    try {
        await Gear.deleteOne({ _id: req.params.id })
        res.status(204).send()
    } catch {
        res.status(404)
        res.send({ error: "Item doesn't exist!" })
    }
})

module.exports = router
