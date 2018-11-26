const express = require('express');
const cors = require('cors');
const db = require('./database/dbConfig');
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

server.listen(3300, () => console.log('\nserver is running on port 3300\n'))