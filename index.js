const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const db = require('./data/dbHelpers.js');

const server = express();

server.use(express.json())
server.use(cors())

const PORT = 4400;

server.get('/', (req, res) => {
    res.send('Hello there!');
});

server.post('/api/register', (req, res) => {
    const user = req.body;
    user.password = bcrypt.hashSync(user.password, 14);
    db.insertUser(user)
        .then(ids => {
            res.status(201).json({ id: ids[0] });
        })
        .catch(err => {
            res.status(500).send(err);
        })
});

server.post('/api/login', (req, res) => {
    const bodyUser = req.body;
    db.findByUsername(bodyUser.username)
        .then(users => {
            console.log('body user', bodyUser);
            console.log('db user', users[0]);
            if (users.length && bcrypt.compareSync(bodyUser.password, users[0].password)) {
                res.json({ info: 'correct' })
            } else {
                res.status(404).json({ err: 'You shall not pass!' })
            }
        })
        .catch(err => {
            res.status(500).send(err);
        })
})

server.listen(4400, () => console.log(`Listening on port ${PORT}`));