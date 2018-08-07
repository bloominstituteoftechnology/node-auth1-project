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
            db('users')
                .where({ id: ids[0] })
                .first()
                .then(user => {
                    res.status(201).json(user);
                })

        })
        .catch(err => {
            res.status(500).json(err);
        })
});

server.post('/api/login', (req, res) => {
    const credentials = req.body;


    db('users')
        .where({ username: credentials.username }).first()
        .then(user => {
            if (!user || !bcrypt.compareSync(credentials.password, user.password)) {
                return res.status(401).json({ error: 'You shall not pass!' });
            }
            else {
                res.status(201).json({ message: 'Logged in' });


            }
        })
    .catch(err => {
        res.status(500).json(err);
    })

})

const port = 8000;
server.listen(port, function () {
    console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});