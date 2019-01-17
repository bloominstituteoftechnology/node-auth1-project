const express = require('express');
const knex = require('knex');
const bcrypt = require('bcryptjs');

const dbConfig = require('./knexfile');
const db = knex(dbConfig.development);

const server = express();
server.use(express.json());

server.get('/api/users', (req, res) =>{
    db('users') 
        .select('id', 'username')
        .then(users => {
            res.json(users);
        })
    .catch(() =>{
        res.status(500).json({message: 'You shall not pass'})
    })    
})


server.listen(5000, () =>{
    console.log('Server is up and running!');
})