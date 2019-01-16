const express = require('express');
//const cors = require('cors');   //necessary for react frontend
const bcrypt = require('bcryptjs'); //open source Hashing

const knex = require('knex');   // pre-Helpers
const dbConfig = require('./knexfile'); // pre-Helpers

//add helpers later
//const db = require('./database/dbHelpers.js');

const server = express();
const db = knex(dbConfig.development); // pre-Helpers
const PORT = 3000;

server.use(express.json());
//server.use(cors());

server.get('/', (req , res) => {
    res.send("LIVE FROM BKK!!");
});

server.post('/api/register', (req , res) => {
    const user = req.body;
    //bcrypt goes here
    user.password = bcrypt.hashSync(user.password, 14);
    db('users').insert(user)
    .then(ids => {
        res.status(201).json({id: ids[0]});
    })
    .catch(err => {
        res.status(500).send(err);
    });
});

// server.post('/api/login', (req, res) => {
//     const bodyUser = req.body;
//     .then
// })


server.listen(PORT, () => console.log(`running on port ${PORT}`));

