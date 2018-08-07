const express = require('express');
const db = require('./data/db');
const bcrypt = require('bcryptjs');

const server = express();

server.use(express.json());

server.post('/api/register', (req, res) => {
    const credentials = req.body;
    const hash = bcrypt.hashSync(credentials.password, 14);
    credentials.password = hash;

    db.insert(credentials)
        .into('users')
        .then(ids => {
            res.status(201).json(ids);
        })
        .catch(err => {
            res.status(500).json(err);
        })
});

server.post('/api/login', (req, res) => {
    const credentials = req.body;
    db.insert(credentials)
        .into('users')
        .then(ids => {
            res.status(201).json(ids);
        })
        .catch(err => {
            res.status(500).json("You shall not pass!");
        })

})

const port = 8000;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});