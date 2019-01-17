const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('./database/dbConfig.js');

const server = express();

server.use(express.json());

//register new users
server.post('/api/register', (req, res) => {
    const creds = req.body;
    db('users')
        .where({ username: creds.username })
        .first()
        .then(user => {
            if (user) {
                res.status(422).json({ message: 'That username is taken' })
            } else {
                const hash = bcrypt.hashSync(creds.password, 14);
                creds.password = hash;
                db('users').insert(creds).then(id => {
                    req.session.userId = id;
                    res.status(201).json(id)
                }).catch(err => res.json(err));
            }
        })
        .catch(err => res.json(err));
})

//login existing users
server.post('/api/login', (req, res) => {
    const creds = req.body;
    db('users')
        .where({ username: creds.username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(creds.password, user.password)){
                req.session.userId = user.id;
                res.status(200).json({ message: 'Successfully logged in!' });
            } else {
                res.status(401).json({ message: 'Login failed.'})
            }
        })
        .catch(err => res.json(err))
})

server.listen(42, () => {
    console.log('Listening on port 42');
})