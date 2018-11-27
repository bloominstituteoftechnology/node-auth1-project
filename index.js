const express = require('express')
const bcrypt = require('bcryptjs')
const knex = require('knex')
const knexConfig = require('./knexfile.js')
const cors = require('cors')
const db = knex(knexConfig.development)
const server = express();
const session = require('express-session')
const KnexSessionStore = require('connect-session-knex')(session)

const sessionConfig = {
    secret: 'ndsuf23u8589jdsg8j398u43gjsjdfa',
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

server.use(session(sessionConfig))
server.use(express.json())
server.use(cors())

const protected = function(req, res, next) {
    if(req.session && req.session.username) {
      next();
    } else {
      res.status(401).json({ message: 'Please log in' })
    }
  }

server.get('/', (req, res) => {
    res.send('im running')
})

server.post('/api/register', (req, res) => {
    const credentials = req.body

    const hash = bcrypt.hashSync(credentials.password, 14)
    credentials.password = hash;

    db('users')
        .insert(credentials)
        .then(ids => {
            const id = ids[0]
            res.status(201).json({ userId: id })
        })
        .catch(err => {
            res.status(500).json({ message: 'Error registering to the server' })
        })
})

server.post('/api/login', (req, res) => {
    const creds = req.body

    db('users')
        .where({ username: creds.username })
        .first()
        .then(user => {
            if(user && bcrypt.compareSync(creds.password, user.password)) {
                req.session.username = user.username
                res.status(200).json({ welcome: user.username })
            } else {
                res.status(401).json({ message: 'Error logging in' })
            }
        })
        .catch(err => {
            res.status(500).json({ message: 'Error' })
        })
})

server.get('/api/users', protected, (req, res) => {
    db('users')
      .select('id', 'username', 'password')
      .then(users => {
        res.json(users);
      })
      .catch(err => res.send(err));
  });

server.listen(9000, () => console.log('server is running'))