const express = require('express');
const router = express.Router();
const knex = require('knex');
const knexConfig = require('../knexfile');
const bcrypt = require('bcryptjs');

//connection to the data base
const db = knex(knexConfig.development);

router.post('/', async(req, res) => {
    try {
        const credentials = req.body; 
        const hash = bcrypt.hashSync(credentials.password, 14);
    
        credentials.password = hash;
    
        const newUser = await db('users').insert(credentials);
        res.status(200).json(newUser);
    }
    catch (err){
        json.status(500).json({message: "There was an error trying to register"});
    }

})

module.exports = router;