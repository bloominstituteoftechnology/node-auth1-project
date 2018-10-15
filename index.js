const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcrypt');
const knex = require('knex');
const knexConfig = require('knexfile');

const db = knex(knexConfig.development);

const server = express();

server.use(express.json(), cors(), helmet(), bcrypt());

server.get('/', (req, res) => {
    res.send('It lives!');
});

server.post('api/register', (req, res) => {
    const credentials = req.body;
    const hash = bcrypt.hashSync(credentials.password, 12)
    credentials.password = hash;
    db('users')
        .insert(credentials)
        .then(ids => {
            res.status(201).json(ids[0])
        })
        .catch(err => {
            res.status(500).json(err)
        });
})

server.post('api/login', (req, res) => {
    const credentials = req.body;
    db('users')
        .where({ username: credentials.username })
        .first()
        .then(user => {
            user && bcrypt.compareSync(creds.password,user.password)?
            res.status(200).send('Access granted'):
            res.status(401).send('Access denied')
        })
        .catch(err => {
            res.status(500).json(err)
        });
})