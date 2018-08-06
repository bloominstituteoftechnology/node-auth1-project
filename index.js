const express = require('express')
const bcrypt = require('bcryptjs')

const db = require('./data/db')

const server = express()

server.use(express.json())

server.listen(3300, () => console.log('API running on port 3300'))

server.get('/', (req, res) => {
    console.log("Hello")
    res.send("It's alive")
})

server.post('/api/register', (req, res) => {
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

server.post('/api/login', (req, res) => {
    const credentials = req.body

    const user = db('users')
                        .where({userName: credentials.userName})
                        .then(user => {
                            console.log(user)
                        })
                        .catch( err => res.status(500).json(err.message))

    if(!user || !bcrypt.compareSync(credentials.password, credentials.userName)){
        return res.status(401).json({error: "Incorrect Credentials"})
    }
    const hash = bcrypt.hachSync(credentials.password, 14)
})