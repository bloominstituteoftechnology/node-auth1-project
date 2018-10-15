const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const db = require('./data/dbConfig.js');

const server = express();

server.use(express.json());
server.use(cors());

//routes 

server.get('/users', (req, res) => {
    db('users').select('id', 'username', 'password').then(users => res.status(200).json(users))
    .catch(err => res.status(500).json(err))
})

server.post('/register', (req, res) => {
    const newUser = req.body;
    const hash = bcrypt.hashSync(newUser.password, 14);
    newUser.password = hash;
    db('users').insert(newUser).then(ids => {
        const id = ids[0];
        res.status(201).json({ newUserId: id }).catch(err => res.status(500).json(err))
    })
})

server.post('/login', (req, res) => {
    const userLog = req.body;
    db('users').where({ username: userLog.username }).first().then(user => {
        if(user && bcrypt.compareSync(userLog.password, user.password)) {
            res.status(200).json({ welcome: user.username})
        } else {
            res.status(401).json({ LoginError: 'User name and/or password does not exist!' })
        }
    }).catch(err => res.status(500).json(err))
})

server.listen(9000, () => {
    console.log('\nServer running on port 9000\n')
})