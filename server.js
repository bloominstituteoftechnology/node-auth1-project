const express = require('express')
const mongoose = require('mongoose')
const User = require('./user/userModel')

const server = express()

mongoose.connect('mongodb://localhost/user').then(() => {
    console.log('connected to database')
})

server.use(express.json())

server.get('/', (req, res) => {
    res.status(200).json({ api: "api running..." })
})

server.post('/api/register', (req, res) => {
    const newUser = { username, password } = req.body
    User.create(newUser)
        .then( user => res.status(201).json(user) )
        .catch( err => res.status(500).json({ error: err.message }))
})

// server.post('/api/login', (req, res) => {
//     const user = { username, password } = req.body
//     User.
// })

server.listen(5000, () => {
    console.log('api running on port 5000')
})