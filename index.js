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

server.listen(3300, () => console.log('\nserver is running on port 3300\n'))