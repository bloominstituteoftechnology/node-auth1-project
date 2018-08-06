const express = require('express');
const db = require('./data/db.js');
const bcrypt = require('bcryptjs');
const helmet = require('helmet');

const server = express();

server.use(express.json());
server.use(helmet());


// AUTH REGISTER
server.post('/api/register', (req, res) => {
    const register = req.body;

    const hash = bcrypt.hashSync(register.password, 14);

    register.password = hash;

    db.insert(register)
     .into('project')
     .then(ids => ({ id: ids[0] }))
     .then(response => {
         res.status(201).json(response[0]);
     })
     .catch(err => {res.status(404).json(err)});
})

// AUTH LOGIN
server.post('/api/login', (req, res) => {
    const login = req.body;

    if (!user || !bcrypt.compareSync(login.password, user.password)) {
        return res.status(401).json({ error: 'You shall not pass!' });
    }

    db.insert(login)
    .into('project')
    .then(ids => ({ id: ids[0] }))
    .then(response => {
        res.status(200).json(response[0]);
    })
    .catch(err => {res.status(404).json(err)});
})

// AUTH USERS
server.get('/api/users', (req, res) => {

    db.select()
    .table('project')
    .then(response => {
        res.status(200).json(response);
    })
    .catch(err => {res.status(500).json(err)});
})


const port = 8000;
server.listen(port, () => {
    console.log(`\n === Auth API listening on http://localhost:${port} ===\n`);
});