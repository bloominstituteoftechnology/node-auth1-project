const express = require('express');
const router = express.Router();
const db = require('../data/helpers/loginDb');

// login
router.post('/', async (req, res) => {
    try {
        const newRecord = { ...req.body };
        const record = await db.add(newRecord);

        res.status(200).json(newRecord);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
