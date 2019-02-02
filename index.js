const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const db = require('./data/dbHelpers.js');

const server = express();

server.use(express.json())
server.use(cors())

const PORT = 4400;

server.get('/api/users', (req, res) => {
    db.getUsers()
        .then(users => {
            res.json(users)
        })
        .catch(err => {
            res.status(500).send(err)
        });
});

server.post('/api/register', (req, res) => {
    const user = req.body;
    user.password = bcrypt.hashSync(user.password, 14);
    db.insertUser(user)
        .then(([id]) => {
            res.status(201).json({ id });
        })
        .catch(err => {
            res.status(500).send(err);
        })
});

server.post('/api/login', (req, res) => {
    const bodyUser = req.body;
    db.findByUsername(bodyUser.username)
        .then(users => {
            if (users.length && bcrypt.compareSync(bodyUser.password, users[0].password)) {
                res.json({ info: 'Logged in' })
            } else {
                res.status(404).json({ err: 'You shall not pass!' })
            }
        })
        .catch(err => {
            res.status(500).send(err);
        })
})

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));