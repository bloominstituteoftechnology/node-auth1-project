const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const bcrypt = require('bcrypt')
const db = require('./database/config.js')

const server = express()

server.use(express.json())
server.use(cors())
server.use(helmet())

server.post('/api/login', (req, res) => {
    const creds = req.body
    db('users')
        .where({ username: creds.username })
        .first()
        .then(user => {
            user && bcrypt.compareSync(creds.password, user.password) ?
            res.status(200).json({ message: 'login successful!' }) :
            res.status(401).json({ message: 'better luck next time >:[' })
        })
        .catch(err => res.json(err))
})

server.post('/api/register', (req, res) => {
    const creds = req.body
    const hash = bcrypt.hashSync(creds.password, 15)
    creds.password = hash
    db('users')
        .insert(creds)
        .then(ids => res.status(201).json(ids))
        .catch(err => res.status(500).json(err))
})

server.get('/api/users', (req, res) => {
    db('users')
        .select('id', 'username')
        .then(users => res.status(200).json(users))
        .catch(err => res.status(500).json(err))
})

server.listen(3300, () => console.log('\n servin up on port 3300\n'));
