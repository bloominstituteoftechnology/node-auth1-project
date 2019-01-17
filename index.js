const express = require('express');
const knex = require('knex');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const dbConfig = require('./knexfile');

const server = express();
const db = knex(dbConfig.development);

server.use(express.json());
server.use(helmet());

server.post('/api/register', (req, res) => {
    const user = req.body;
    user.password = bcrypt.hashSync(user.password, 15);

    db('users').insert(user)
        .then(id => {
            res.status(201).json(id);
        })
        .catch(err => {
            res.status(500).json({ errorMessage: 'Failed to insert users' });
        }) 
});

server.post('/api/login', (req, res) => {
   const user = req.body;
   
   db('users').where('username', user.username)
    .then(users => {
        if(users.length && bcrypt.compareSync(user.password, users[0].password)) {
            res.json({ message: 'Logged in' });
        } else {
            res.status(404).json({ message: 'You shall not pass' })
        }
    })
    .catch(err => {
        res.status(500).json({ errorMessage: 'Failed to verify. Please try again.' })
    });
});

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});