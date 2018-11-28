const express = require('express')
const cors = require('cors')
const session = require('express-session')
const KnexSessionStore = require('connect-session-knex')(session)
const helmet = require('helmet')
const bcrypt = require('bcrypt')
const db = require('./database/config.js')

const server = express()

const sessionConfig = {
    name: 'session',
    secret: 'bees are underrated',
    cookie: {
        maxAge: 1000 * 60 * 60,
        secure: false
    },
    httpOnly: true,
    resave: false,
    saveUninitialized: false,
    store: new KnexSessionStore({
        tablename: 'sessions',
        sidfieldname: 'sid',
        knex: db,
        createtable: true,
        clearInterval: 1000 * 60 * 60
    })
}

server.use(express.json())
server.use(cors({ origin: 'http://localhost:3000', credentials: true }))
server.use(session(sessionConfig))
server.use(helmet())
server.use(restricted)

function restricted(req, res, next) {
    if (req.url.includes('/api/restricted')) {
        req.session && req.session.user ?
        next() :
        res.status(401).json({ message: 'scram' })
    } else {
        next()
    }
}

server.post('/api/register', (req, res) => {
    const creds = req.body
    const hash = bcrypt.hashSync(creds.password, 15)
    creds.password = hash
    db('users')
        .insert(creds)
        .then(ids => res.status(201).json(ids))
        .catch(err => res.status(500).json(err))
})

server.post('/api/login', (req, res) => {
    const creds = req.body
    db('users')
        .where({ username: creds.username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(creds.password, user.password)) {
                req.session.user = user.id
                res.status(200).json({ message: 'login successful!' })
            }
            else {
                res.status(401).json({ message: 'better luck next time >:[' })
            }
        })
        .catch(err => res.json(err))
})

server.get('/api/restricted/users', (req, res) => {
    db('users')
    .select('id', 'username')
    .then(users => res.json(users))
    .catch(err => res.send(err))
})

server.get('/api/restricted/me', (req, res) => {
    db('users')
    .select('id', 'username')
    .where({ id: req.session.user })
    .first()
    .then(user => res.json(user))
    .catch(err => res.send(err))
})

server.get('/api/logout', (req, res) => {
    if(req.session) {
        req.session.destroy(err => {
            err ?
            res.send('you can never leave') :
            res.send('see you next time')
        })
    } else {
        res.end()
    }
})

server.listen(3300, () => console.log('\n servin up on port 3300\n'));
