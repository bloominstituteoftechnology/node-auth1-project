const express = require('express');
const router = express.Router();
const db = require('../data/helpers/userDb');
const bcrypt = require('bcryptjs');

// login
router.post('/', async (req, res) => {
    try {
        const newRecord = { ...req.body };
        const record = await db.get(newRecord);
        
        if(record.username && bcrypt.compareSync(newRecord.password, record.password)) {
            res.status(200).json({message: 'Login Successful'});
        } else {
            res.status(401).json({message: 'Incorrect Credentials'});
        }

    } catch (err) {
        res.status(500).json({error: err});
    }
});

module.exports = router;
