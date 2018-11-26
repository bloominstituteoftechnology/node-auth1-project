const express = require('express');
const server = express();
const bcrypt = require('bcryptjs');

const db = require('./data/db');


server.use(express.json());

const port = 3300;

server.listen(port, function() {
    console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
    
});

server.post('/api/register', (req, res) => {
    let userInfo = req.body;
    const hash = bcrypt.hashSync(userInfo.password, 8);
    userInfo.password = hash;
    db.register(userInfo)
    .then(id => {
        res.status(201).json(id);
    })
    .catch(err => {
        res.status(500).json(err)
    })
})

server.post('/api/login', (req,res) => {
    let userInfo = req.body;
    db.login(userInfo)
    .then(user => {
        if(user && bcrypt.compareSync(userInfo.password, user.password)) {
            res.status(200).json({message: 'Logged In', id: user.id})
        } else {
            res.status(401).json({message: 'You shall not pass!'})
        }
    })
    .catch(err => {
        res.status(500).json({message: 'Hey'})
    })
})