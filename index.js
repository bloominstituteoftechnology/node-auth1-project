const express = require('express');
const cors = require('cors');
const db = require('./database/dbConfig');
const bcrypt = require('bcryptjs');
const server = express();

server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
    res.send('Server is alive!');
})

server.get('/api/users', (req, res) => {
    db('users')
    .select('id', 'username', 'password')
    .then(users => {
        res.json(users);
    })
    .catch(err => res.send(err))
})

server.post('/api/register', (req, res) => {
    const creds = req.body;
    const hash = bcrypt.hashSync(creds.password, 3);
    creds.password = hash;
    db('users')
    .insert(creds)
    .then(ids => {
        res.status(201).json(ids);
    })
    .catch(err => res.status(500).json(err));
})

server.post('/api/login', (req, res) => {
    const creds = req.body;
    db('users')
    .where({ username: creds.username })
    .first()
    .then( user => {
        if (user && bcrypt.compareSync(creds.password, user.password)){
            res.status(200).json({ message: "welcome user!"})
        } else {
            res.status(401).json({ message: 'invalid username or password' })
        }
    })
    .catch(err => res.json(err))
})

server.listen(3300, () => console.log('\nserver is running on port 3300\n'))