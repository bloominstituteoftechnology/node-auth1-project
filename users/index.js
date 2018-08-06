const express = require('express');
const router = express.Router();
const db = require('../data/helpers/userDb');

// users
router.get('/', async (req, res) => {
    try {
        const records = await db.get();

        res.status(200).json(records);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const record = await db.get(id);

        res.status(200).json(record);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post('/', async (req, res) => {
    try {
        const newRecord = { ...req.body };
        const record = await db.add(newRecord);

        res.status(200).json(newRecord);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const changes = { ...req.body };
        const change_record = await db.edit(id, changes);
        const record = await db.get(id);
        res.status(200).json(record);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const record = await db.get(id);
        const drop_record = await db.drop(id);

        res.status(200).json(record);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
