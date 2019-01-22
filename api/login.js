const express = require('express');
const router = express.Router();
const knex = require('knex');
const knexConfig = require('../knexfile');
const bcrypt = require('bcryptjs');


//connection to the data base
const db = knex(knexConfig.development);

router.post('/', async (req, res) => {
    try {
        const credentials = req.body;
        const compared = await db('users')
        .where({username: credentials.username})
        .first();

        if(compared && bcrypt.compareSync(credentials.password, compared.password)) {
            //passwords match and user exists by that username
            req.session.compared = compared;
            res.status(200).json({message: "You succesfully logged in"});
          } else {
            //either usrname is invalid or password is wrong
            res.status(401).json({message: 'You shall not pass'});
        }
    }
    catch (err) {
        res.sendStatus(500).json({message: "There was an error trying to log in. Please try again."})
    }
});


module.exports = router;