const express = require('express');
const helmet = require('helmet');
const bcrypt = require("bcryptjs");

const db = require('./database/dbConfig');

const server = express();
const port = 8000;

server.use(helmet(), express.json());

server.get('/', (req, res) => {
    res.send('<h1>Live Server</h1>')
});

server.get('/users', (req, res) => {
    db('users').select('id', 'username').then(users => res.json(users)).catch(err => res.send(err));
});

server.post('/register', (req, res) => {
    const creds = req.body;

    // Has the password
    const hash = bcrypt.hashSync(creds.password, 14);
    creds.password = hash;

    // Save the user to the database
    db('users').insert(creds).then(ids => {
        const id = ids[0];
        res.status(201).json({newUserId: id});
    }).catch(err => res.status(500).send(err));
});

server.post('/login', (req, res) => {
    const creds = req.body;

    db('users').where({ username: creds.username }).first().then(user => {
        if(user && bcrypt.compareSync(creds.password, user.password)) {
            res.status(200).json({ welcome: user.username });
        } else {
            res.status(401).json({ message: 'Username or password is incorrect' });
        }
    }).catch(err => res.status(500).json(err));
});




function runServer() {
    console.log('\x1b[34m', `\n[server] started server`);
    console.log(`[server] running on port: ${port}\n`);
    console.log('\x1b[0m', '');
}

server.listen(port, runServer());