const express = require('express');
const router = express.Router();
const db = require('../data/helpers/userDb');

// users
router.get('/', async (req, res) => {
    try {
        const records = await db.get();
        if (records.length > 0) {
            res.status(200).json(records);
        } else {
            res.status(401).json({message: 'No Records Found'});
        }
    } catch (err) {
        res.status(500).json({error: 'Server Error'});
    }
});

module.exports = router;
