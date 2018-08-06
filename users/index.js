const express = require('express');
const router = express.Router();
const db = require('../data/helpers/userDb');

// users
router.get('/', async (req, res) => {
    try {
        const records = await db.get();

        res.status(200).json(records);
    } catch (err) {
        res.status(500).json({error: err});
    }
});

module.exports = router;
