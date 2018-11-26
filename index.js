const bcrypt = require('bcryptjs')
const express = require('express')
const knex = require('knex')
const knexConfig = require('./knexfile')
db = knex(knexConfig.development)
const server = express()

server.use(express.json())



server.get('/', (req, res) => {
    res.send({message: "API is running"})
})

server.post('/api/register', (req, res) => {
    const creds = req.body
    const hash = bcrypt.hashSync(creds.password, 8)
    creds.password = hash
    db('users')
        .inset(creds)
        .then(ids => {
            res.status(201).json(ids)
        })
        .catch(error => {
            res.status(500).json({ error: "error saving user", error })
        })
})

server.post('/api/login', (req, res) => {
    const creds = req.body
    db('users')
        .where({ username: creds.username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSyncs(creds.password, user.password)) {
                res.status(200).json({ message: "Logged in" })
            } else {
                res.status(401).json({ message: "You shall not pass!" })
            }
        })
        .catch(error => {
            res.status(500).json({ error: "error logging in", error })
        })
})

server.get('/api/users', (req, res) => {
    db('users')
        .select('id', 'username', 'password')
        .then(users => {
            res.json(users)
        })
        .catch(error => {
            res.send(error)
        })
})











const port = 6000;

server.listen(port, () => console.log(`\n Running on port: ${port} \n`));