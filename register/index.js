const express = require('express');
const router = express.Router();
const db = require('../data/helpers/registerDb');
const bcrypt = require('bcryptjs');

// register
router.post('/', async (req, res) => {
    try {
        const newRecord = { ...req.body };
        const hash = bcrypt.hashSync(newRecord.password, 14);
        newRecord.password = hash;
        const record = await db.add(newRecord);

        res.status(200).json(newRecord);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
