// https://github.com/LambdaSchool/auth-i/pull/416

const express = require('express');
const knex = require('knex');
const bcrypt = require('bcryptjs');

const knexConfig = require('./knexfile.js');
const server = express();

const db = knex(knexConfig.development);

server.use(express.json());

server.get('/', (req, res) => {
    res.json('alive and well');
})

server.get('/api/users', async (req, res) => {
    const users = await db('users')
    res.status(200).json(users)
})

server.get('/api/users/:id', async (req, res) => {
    const id = req.params.id;
    const user = await db('users').select('id', 'user').where({ id: id }).first();
    res.status(200).json(user);
})

server.post('/api/register', (req, res) => {
    const creds = req.body;
    const hash = bcrypt.hashSync(creds.password, 14)
    creds.password = hash;
    db('users')
        .insert(creds)
        .then(ids => {
            res.status(201).json(ids);
        })
        .catch(err => console.log(err));
})

const port = 4200;
server.listen(port, console.log(`\n === watching on port ${port} === \n`));