const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const db = require('./database/dbConfig.js');

const server = express();

server.use(express.json());
server.use(cors());


server.post('/api/login', (req, res) => {
    const creds = req.body;
    db('users')
        .where({ username: creds.username })
        .first()
        .then(user => {
            user && bcrypt.compareSync(creds.password, user.password)
                ? res.status(200).json({ message: 'welcome' })
                : res.status(401).json({ message: "You're not welcome" })
        })
        .catch(err => {
            res.status(500).json(err)
        })
});

server.post('/api/register', (req, res) => {
    const creds = req.body;
    const hash = bcrypt.hashSync(creds.password, 14);
    creds.password = hash;
    db('users')
        .insert(creds)
        .then(ids => {
            res.status(201).json(ids);
        })
        .catch(err => {
            res.status(500).json(err)
        })
});

server.get('/api/users', (req, res) => {
    db('users')
        .select('id', 'username')
        .then(users => {
            res.json(users);
        })
        .catch(err => {
            res.status(500).json(err)
        })
});


server.get('/', (req, res) => {
    res.json({ message: 'Up and Running' })
})



server.listen(3333, () => console.log('\nrunning on port 3333\n'));