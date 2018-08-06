const express = require('express');
const bcrypt = require('bcryptjs');

const db = require('./data/db');


const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    res.send("Api Running")
})

server.get('/users', (req, res) => {
    db('users')
        .then(response => {
            res.status(200).json(response)
        })
        .catch(err => {
            res.status(500).json(err)
        })
})

server.post('/register', (req, res) => {
    const userInfo = req.body;
    const hash = bcrypt.hashSync(userInfo.password, 11);
    userInfo.password = hash;
    if(!(userInfo.user || userInfo.password)) {
        res.status(400).json({ error: 'Enter username and password.' })
    } else {
        db('users')
            .insert(userInfo)
            .then(response => {
                res.status(200).json(response)
            })
            .catch(err => {
                res.status(500).json(err)
            })
    }
})

server.post('/login', (req, res) => {
    const userInfo = req.body;
    const username = userInfo.username;
    db('users')
        .where({ username })
        .then(response => {
            const password = response[0].password;
            const passwordMatch = bcrypt.compareSync(msCredentials.password, password);
            if (!passwordMatch) {
                res.status(400).json({ error: 'Please enter valid user information.' })
            } else {
                res.status(200).json({ success: true })
            }
        })
        .catch(err => {
            res.status(500).json({ error: 'Error.' })
        })
})

const port = 8000;
server.listen(port, () => console.log(`\n=== API running on ${port} ===\n`)); 