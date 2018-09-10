const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const bcrypt = require("bcryptjs");

const db = require('./db/dbConfig.js');

const server = express();

server.use(express.json());
server.use(cors());
server.use(helmet());

server.get('/', (req, res) => {
    res.send("API is running...")
});

server.get('/api/users', (req, res) => {
    db('users')
        .select('id', 'username', 'password')
        .then(users => {
            res.json(users);
        })
        .catch(err => res.send(err));
});

server.post('/api/register', (req, res) => {
    const creds = req.body;
    const hash = bcrypt.hashSync(creds.password, 10);
    creds.password = hash;
    db('users')
        .insert(creds)
        .then(ids => {
            const id = ids[0];
            res.status(201).json(id);
        })
        .catch(err => res.status(500).send(err))
});

server.post('/api/login', (req, res) => {
    const creds = req.body;
    db('users')
        .where({ username: creds.username })
        .first()
        .then(user => {
            if(user && bcrypt.compareSync(creds.password, user.password)) {
                res.status(200).send("Login Successful");
            } else {
                res.status(401).json({ message: 'Unauthorized login attempt. Username or Password are incorrect.'})
            }
        })
        .catch(err => res.status(500).send(err));
});

server.listen(6000, () => console.log('\n Running on port 6000 \n'))