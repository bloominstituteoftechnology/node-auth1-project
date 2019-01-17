const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const morgan = require('morgan');

const db = require('./data/dbHelpers.js');
const server = express();
const PORT = 4500;

server.use(express.json());
server.use(cors());
server.use(morgan('dev'));

server.post('/api/register', (req, res) => {
    const user = req.body;
    console.log(user.username, ' and ', user.password);
    user.password = bcrypt.hashSync(user.password, 16);
    console.log('new pass', user.password);
    if (!user.username || !user.password || user.username === '' || !user.password === '') {
        res.status(400).json({ errorMessage: 'Please make sure you input your username and password.' });
    } else {
        db.insert(user)
            .then(ids => {
                res.status(201).json({ id: ids[0] });
            })

            .catch(err => {
                res.status(500).json({ errorMessage: 'Failed to add user ' });
            });
    };
});

server.post('/api/login', (req, res) => {
    const bodyUser = req.body;
    db.findByUsername(bodyUser.username)
        .then(users => {
            if (users.length && bcrypt.compareSync(bodyUser.password, users[0].password)) {
                res.status(200).json({ info: 'correct' });
            } else {
                res.status(404).json({ errorMessage: 'Invalid username or password. ' });
            }
        })
        .catch(err => {
            res.status(500).json({ errorMessage: 'I iz broken. ' });
        });
});

server.get('/api/users', (req, res) => {
    db.get()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => {
            res.status(500).json({ errorMessage: 'Failed to get users' });
        });
});

server.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
});