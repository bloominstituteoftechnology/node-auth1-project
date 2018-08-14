const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('./data/db.js');
const server = express();

server.use(express.json());


// ==== USER REQUESTS ====

server.get('/users', (req, res) => {
    db('users')
        .then(users => {
            res.status(200).json(users)
        })
        .catch( err => res.status(500).json(err) )
})

server.post('/register', (req, res) => {
    const user = req.body;

    const hash = bcrypt.hashSync(user.password, 14);
    user.password = hash;

    db('users')
        .insert(user)
        .then( ids => {
            db('users')
                .where({ id: ids[0] })
                .first()
                .then( user => {
                    res.status(201).json(user);
                })
        })
        .catch(err => res.status(500).json(err))
})

server.post('/login', (req, res) => {
    const credentials = req.body;

    db('users')
        .where({ name: credentials.name})
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(credentials.password, user.password)) {
                return res.status(200).json('Success: you are logged in!')
            } else {
                return res.status(401).json({ error: 'you shall not pass!'})
            }
        })
})


server.listen(3300, () => console.log('\n==== API is running... ====\n'))