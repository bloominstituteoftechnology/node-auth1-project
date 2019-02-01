const express = require('express')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const db = require('./data/dbConfig.js')


const PORT = 5100
const server = express()
server.use(express.json())
server.use(cors())

server.post('/api/register', (req, res) => {
    const creds = req.body
    const hash = bcrypt.hashSync(creds.password, 14)
    creds.password = hash
    db('users')
    .insert(creds)
    .then(ids => {
        res.status(201).json(ids)
    })
    .catch(() => {
        res.status(500).json({ error: 'Unable to register user.'})
    })
})

server.post('/api/login', (req, res) => {
    const creds = req.body
    db('users')
    .where({ username: creds.username })
    .first()
    .then(user => {
        if (user && bcrypt.compareSync(creds.password, user.password)) {
            res.status(200).json({ message: `${user.username} is logged in` })
        } else {
            res.status(401).json({ message: 'You shall not pass!' })
        }
    })
    .catch(err => res.json(err))
})

server.get('/api/users', (req, res) => {
    db('users')
      .select('id', 'username', 'password') //<----NEVER EVER SEND THE PASSWORD BACK TO THE CLIENT, THIS IS WHAT NOT TO DO!!!
      .then(users => {
        res.json(users)
      })
      .catch(() => {
          res.status(401).json({ message: 'You shall not pass!'})
      })
  })



server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})