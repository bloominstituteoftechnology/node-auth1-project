const express = require('express')
const bcrypt = require('bcryptjs')
const cors = require('cors')
const protected = require('./middleware/protected.js')
const session = require('express-session')
const helmet = require('helmet')

const db = require('./data/dbConfig.js')
const server = express()

server.use(express.json())
server.use(cors())
server.use(helmet())



server.post('/api/register', async (req, res) => {
    try {
        const creds = req.body
        const hash = bcrypt.hashSync(creds.password, 14)
        creds.password = hash
        const id = await db('users').insert(creds)
        res.status(201).json(id)
    } catch (e) {
        res.status(500).json({ error: 'An error occuried during the registration process.' })
    }
})

server.post('/api/login', async (req, res) => {
    try {
        const creds = req.body
        const user = await db('users').where({ username: creds.username }).first()
        user && bcrypt.compareSync(creds.password, user.password)
            ? res.status(200).json({ message: 'Logged in' })
            : res.status(401).json({ message: 'You shall not pass!' })
    } catch (e) {
        res.status(500).json({ message: 'A server error occuried while attempting to log in.' })
    }
})

server.get('/api/users', async (req, res) => {
    try {
        const users = await db('users').select('id', 'username')
        res.status(200).json(users)
    } catch (e) {
        res.status(500).json({ error: 'An error occuried while accessing users from the database.' })
    }
})

server.listen(9000, () => console.log(`Server is active on port 9000`))
