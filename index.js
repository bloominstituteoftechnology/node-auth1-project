const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('./data/db.js');

const server = express();
server.use(express.json());


server.get('/api/users', (req, res) => {
    db('user')
    .then(function(user) {
        if(user.isLoggedIn===true) {
            return res.status(200).json(user)
        }
    })
    .catch(err => {
        res.status(500).json('You shall not pass!')
    })
})

server.post('/api/register', (req, res) => {
    const credentials = req.body;
    const hash = bcrypt.hashSync(credentials.password, 14);
    credentials.password = hash;
    db('users')
    .insert(credentials)
    .then(function(ids) {
        db('users')
        .where({id: ids[0]})
        .first()
        .then(user => {
            res.status(201).json(user);
        })
    })
    .catch(err => {
        res.status(500).json({error: 'There was an error saving user to database.'})
    })
})

server.post('/api/login', (req, res) => {
    const credentials = req.body;
    db('users')
    .where({username: credentials.username}).first()
    .then(function(user) {
    if(!user || !bcrypt.compareSync(credentials.password, user.password)) {
        return res.status(401).json('You shall not pass!')
    }
    else {
        credentials.isLoggedIn = true;
        return res.status(200).json(user)
    }
})
})


server.listen(8000, console.log('API running'));