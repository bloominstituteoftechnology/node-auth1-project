const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('./data/dbHelpers.js');

const server = express();

server.use(express.json());
const PORT = 5000;

server.get('/', (req, res) => {
    res.send('API is Active');
});

server.post('/api/register', (req, res) => {
    const user = req.body;
    user.password = bcrypt.hashSync(user.password, 16);
    db.insertUser(user)
        .then(ids => {
            res.status(201).json({ id: ids[0] });
        })
        .catch(err => {
            res.status(500).send(err);
        });
});

server.post('/api/login', (req, res) => {
    const user = req.body;
    db.findByUsername(user.username)
        .then(users => {
            if (users.length && bcrypt.compareSync(user.password, users[0].password)) {
                res.json({ info: "correct" });
            } else {
                res.status(404).json({ err: "Invalid username or password" });
            }
        })
        .catch(err => {
            res.status(500).send(err);
        });
});

server.get('/api/users', (req, res) => {
    db.getUsers()
        .then(users => {
            res.json(users);
        })
        .catch(err => res.send(err));
});

server.listen(PORT, () => console.log(`\nServer running on port ${PORT}\n`));