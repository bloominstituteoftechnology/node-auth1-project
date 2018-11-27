const bcrypt = require('bcryptjs')
const express = require('express')
const cors = require('cors')
const session = require('express-session')
const KnexSessionStore = require('connect-session-knex')(session)

const db = require('./data/dbConfig.js')

const server = express()

const sessionConfig = {
    name: '',
    secret: '',
    cookie: {
        maxAge: 1000 * 60 * 10,
        secure: false,
    },
    httpOnly: true,
    resave: false,
    saveUnintialized: false,
    store: new KnexSessionStore({
        tablename: 'sessions',
        sidfieldname: 'sid',
        knex: db,
        createtable: true,
        clearInterval: 1000 * 60 * 60
    })
}

server.use(session(sessionConfig))
server.use(express.json())
server.use(cors())



server.post('/api/login', (req, res) => {
    const creds = req.body
    db('users')
        .where({ username: creds.username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSyncs(creds.password, user.password)) {
                req.session.user = user.id
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
    if (req.session && req.session.userId) {
        db('users')
        .select('id', 'username', 'password')
        .then(users => {
            res.json(users)
        })
        .catch(error => {
            res.send(error)
        })
    } else {
        res.status(401).json({ message: "you shall not pass!" })
    }
    
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



server.get('/', (req, res) => {
    res.send({message: "API is running"})
})









const port = 6000;

server.listen(port, () => console.log(`\n Running on port: ${port} \n`));