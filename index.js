const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const db = require('./data/dbConfig.js');

const server = express();
const port = 9000; 

//globale middleware
server.use(cors());
server.use(express.json());

//Get users
server.get('/api/users', (req, res) => {
    db('users')
        .select('id', 'username')
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => res.status(500).json(err))
})

//Post create user 
server.post('/api/register', (req, res) => {
    const credentials = req.body;
    const hash = bcrypt.hashSync(credentials.password, 14);
    credentials.password = hash;

    db('users').insert(credentials).then(ids => {
        const id = ids[0];
        res.status(201).json({ newUserId: id })
    }).catch(err => {
        res.status(500).json({ err });
    });
})

//Post check user
server.post('/api/login', (req, res) => {
    const credentials = req.body;

    db('users').where({username: credentials.username}).first().then(user => {
        if(user && bcrypt.compareSync(credentials.password, user.password)) {
            res.status(200).json({message: 'Access granted'})
        } else {
            res.status(401).json({message: 'Invalid username and/or password'})
        }
    }).catch(err => res.status(500).json({err}));
})


//listening
server.listen(port, () => console.log(`\nAPI running on http://localhost:${port}\n`));