const express = require('express');
const data = require('../models/dataModel.js');
const router = express.Router();
const bcrypt = require('bcryptjs');

router.post('/register', (req, res)=>{
    const hash = bcrypt.hashSync(req.body.password, 14);
    req.body.password = hash;
    const {username, password} = req.body;
    const user = {username, password};
    data.register(user)
        .then(ids =>{
            const id = ids[0];
            res.status(201).json({newUserId: id});
        })
        .catch(err => res.status(500).json(err.message));
});

module.exports = router;