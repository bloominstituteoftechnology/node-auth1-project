const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const db = require('./database/dbConfig');
const Users = require('./users/users-model');

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
    res.send("Hello from webauth-i-challenge");
});

server.post('/api/register', (req, res) => {
    let user = req.body;
    const hash = bcrypt.hashSync(user.password, 10);
    user.password = hash;

    Users.add(user)
        .then(saved => {
            res.status(201).json(saved);
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

const port = process.env.PORT || 4000;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));