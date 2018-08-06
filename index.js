const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const db = require('./data/db')
const server = express();

server.use(express.json());
server.use(morgan('dev'));
server.use(helmet());

server.get('/api/users', (req, res) => {
    db("users")
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

server.post('/api/register', (req, res) => {
    const user = req.body;

    const hash = bcrypt.hashSync(user.password, 14);

    user.password = hash;

    db('users')
        .insert(user)
        .then(response => {
            res.status(200).json({ Message: "Success!" })
        })
        .catch(err => {
            res.status(500).json(err);
        })
})

server.post('/api/login', (req, res) => {
    const credentials = req.body;

    db("users")
        .where({ username: credentials.username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(credentials.password, user.password)) {
                res.send("Hello!");
            } else {
                return res.status(501).json({ message: "Bad credentials" });
            }
        })
        .catch(err => {
            res.status(500).json(err);
        });
});
server.listen(8000, () => console.log('API running on port 8000... *.*'));