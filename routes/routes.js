const express = require('express');
const data = require('../models/dataModel.js');
const router = express.Router();
const bcrypt = require('bcryptjs');

router.post('/register', (req, res)=>{
    const {username, password} = req.body;
    const hash = bcrypt.hashSync(password, 14);
    password = hash;
    const user = {username, password};
    data.register(user)
        .then(ids =>{
            const id = ids[0];
            res.status(201).json({newUserId: id});
        })
        .catch(err => res.status(500).json(err.message));
});