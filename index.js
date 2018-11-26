const express = require('express');
const cors = require('cors');
const db = require('./database/dbConfig.js');
const bcrypt = require('bcryptjs')


//POST to /api/register
//POST to /api/login
//GET to /api/users
const server = express();

server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
    res.send('Server is running properly');
});

server.get('/api/users', (req, res) => {
    db('users')
        .select('username','password')
        .then(users => {
            res.json(users);
        })
        .catch(err => res.send(err));
});//for testing purposes will be revamped

server.post('/api/register', (req,res) => {
    const creds = req.body;
    creds.password = bcrypt.hashSync(creds.password, 14)
    db('users').insert(creds)
    .then(userId => {
        res.status(201).json(userId);
    })
    .catch(err => {
        res.status(500).json({error : err})
    })
})

server.listen(9000, () => console.log('\nrunning on port 9000\n'));