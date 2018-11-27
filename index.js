const express = require('express')
const bcrypt = require('bcryptjs')
const cors = require('cors')
const session = require('express-session')
const KnexSessionStore = require('connect-session-knex')(session)
const helmet = require('helmet')

const db = require('./data/dbConfig.js')
const server = express()

const sessionConfig = {
    secret            : 'alsdfldsklsdfkldflfdff',
    cookie            : {
        maxAge : 1000 * 60 * 10,
        secure : false,
    },
    httpOnly          : true,
    resave            : false,
    saveUninitialized : false,
    store             : new KnexSessionStore({
        tablename     : 'sessions',
        sidfieldname  : 'sid',
        knex          : db,
        createtable   : true,
        clearInterval : 1000 * 60 * 60,
    }),
}
server.use(session(sessionConfig))
server.use(express.json())
server.use(cors())
server.use(helmet())

function protected(req, res, next){
    if (req.session && req.session.userId) {
        // they're logged in, go ahead and provide access
        next()
    }
    else {
        // bounce them
        res.status(401).json({ you: 'shall not pass!!' })
    }
}

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
        if (user && bcrypt.compareSync(creds.password, user.password)) {
            req.session.userId = user.id
            res.status(200).json({ message: 'Logged in' })
        }
        else {
            res.status(401).json({ message: 'You shall not pass!' })
        }
    } catch (e) {
        res.status(500).json({ message: 'A server error occuried while attempting to log in.' })
    }
})

server.get('/api/users', async (req, res) => {
    if (req.session && req.session.userId) {
        try {
            const users = await db('users').select('id', 'username')
            res.status(200).json(users)
        } catch (e) {
            res.status(500).json({ error: 'An error occuried while accessing users from the database.' })
        }
    }
    else {
        res.status(401).json({ message: 'You shall not pass.' })
    }
})
server.get('/api/restricted', protected, async (req, res) => {
    try {
        const user = await db('users').select('id', 'username').where({ id: req.session.userId }).first()
        res.status(200).json(user)
    } catch (e) {
        res.status(500).json({ error: 'An error occuried' })
    }
})
server.get('/api/restricted/:id', protected, async (req, res) => {
    try {
        const user = await db('users').select('id', 'username').where({ id: req.session.userId }).first()
        res.status(200).json(user)
    } catch (e) {
        res.status(500).json({ error: 'An error occuried' })
    }
})

server.listen(9000, () => console.log(`Server is active on port 9000`))
