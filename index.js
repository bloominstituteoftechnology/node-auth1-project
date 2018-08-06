const express = require('express')
const bcrypt = require('bcryptjs')

const db = require('./data/db')

const server = express()

server.use(express.json)

server.listen(8000, () => console.log('API running on port 8000'))

server.get('/', (req, res) => {
    res.send("It's alive")
})

server.post('/register', (req, res) => {
    const credentials = req.body

    const hash = bcrypt.hashSync(credentials.password, 14)

     credentials.password = hash

     db('users')
        .insert(credentials)
        .then(function(ids) {
            db('users')
                .where({ id: ids[0] })
                .first()
                .then(user => {
                    res.status(201).json(user)
                })
        })
        .catch(err => {
            res.status(500).json({ error: err.message })
        })
})