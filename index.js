const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session')
const KnexSessionStore = require('connect-session-knex')(session)

const db = require('./data/dbConfig.js');

const server = express();

const sessionConfig = {
    secret: 'shhh',
    name: 'tempuser',
    httpOnly: true,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 1
    },
    store: new KnexSessionStore({
        tablename: 'sessions',
        sidfieldname: 'sid',
        knex: db,
        createtables: true,
        clearInterval: 1000 * 60 * 60, // clears expired sessions 
    })
}

server.use(session(sessionConfig))
server.use(express.json());


function sessionCheck(req, res, next) {
    if (req.session && req.session.username) {
        next();
    }
    else {
        res.json({message: 'not authorized'})
    }    
}

// routes 



server.get('/users', sessionCheck, (req, res) => {
    db('users').select('id', 'username', 'password').then(users => res.status(200).json(users))
    .catch(err => res.status(500).json(err))
})

server.post('/register', (req, res) => {
    const newUser = req.body;
    const hash = bcrypt.hashSync(newUser.password, 14);
    newUser.password = hash;
    db('users').insert(newUser).then(ids => {
        const id = ids[0];
        res.status(201).json({ newUserId: id }).catch(err => res.status(500).json(err))
    })
})

server.post('/login', (req, res) => {
    req.session.username = req.body.username;
    const userLog = req.body;
    db('users').where({ username: userLog.username }).first().then(user => {
        if(user && bcrypt.compareSync(userLog.password, user.password)) {
            res.status(200).json({ welcome: user.username})
        } else {
            res.status(401).json({ LoginError: 'User name and/or password does not exist!' })
        }
    }).catch(err => res.status(500).json(err))
})

server.get('/logout', (req, res) => {
    if(req.session) {
        req.session.destroy(err => {
            if(err) {
                res.send(err)
            } else {
                res.send("You have logged out")
            }
        })
    }
})


// server

server.listen(9000, () => {
    console.log('\nServer running on port 9000\n')
})