const express = require('express')
const router = express.Router()

const Gear = require('../models/gear')

router.post('/', async (req, res) => {
    const item = new Gear(req.body)
    await item.save()
    res.send(item)
})

router.get('/', async (req, res)=>{
    try {
        const gear = await Gear.find({})
        res.json(gear)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get('/:id', async (req, res)=>{
    const item = await Gear.findOne({ _id: req.params.id })
	res.send(item)
})

module.exports = router
