const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const knex = require('knex');
const knexConfig = require('./knexfile');
const db = knex(knexConfig.development);

const server = express();
server.use(express.json());
server.use(cors());

server.post('/api/register', (req, res) => {
    const creds = req.body;
    const hash =  bcrypt.hashSync(creds.password, 8);
    creds.password = hash;

    db('users')
        .insert(creds)
        .then(ids => {
            res.status(201).json(ids);
        })
        .catch(error => {
            res.status(500).json(error)
        });
} )

server.post('/api/login', (req, res) => {
    const creds = req.body;

    db('users')
        .where({username: creds.username }).first()
        .then(user => {
            if(user && bcrypt.compareSync(creds.password, user.password)){
                res.status(200).json({ message: 'WELCOME!'})
            }else{
                res.status(401).json({ message: 'WRONG CREDENTIALS!!'})
            }
        })
        .catch(error => {
            res.status(500).json(error)
        })
})

server.listen(8000, () => console.log('running on port 8000'));