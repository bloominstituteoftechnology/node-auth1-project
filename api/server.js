const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcryptjs')
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const dbConfig = require('../dbConfig.js');


const Users = require('../helpers/model.js')
const server = express();
server.use(express.json());
server.use(cors());
server.use(helmet());

const sessionConfig = {
    name: 'someName',
    secret: 'the secret message',
    cookie: {
        maxAge: 1000 * 60 * 120,
        secure: false // it's fine to use over http for dev
    },
    httpOnly: true, 
    resave: false,
    saveUninitialized: false,

    store: new KnexSessionStore({
        knex: dbConfig,
        tablename: 'sessions',
        sidfieldname: 'sid',
        createtable: true,
        clearInterval: 1000 * 60 * 120,
    })
}
server.use(session(sessionConfig));


// *** End points ***
// POST Register end point
server.post('/api/register', (req, res) => {
    let user = req.body;
    if (user.username && user.password) {
        const hash = bcrypt.hashSync(user.password,4);
        user.password = hash;
        Users.add(user)
        .then(saved => {
            res.status(201).json(saved);
        })
        .catch(err => {
            res.status(500).json({message: "The username exists!"});
        })
    } else {
        res.status(400).json({message: "Please make sure you have both username and password! "});
    }
})

// POST login endpoint
server.post('/api/login', (req, res) => {
    let user = req.body;
    if (user.username && user.password) {
        Users.findBy({"username": user.username})
        .first()
        .then(info => {
            if (info && bcrypt.compareSync(user.password, info.password)) {
                req.session.user = user;
                res.status(200).json({cookie: req.session.cookie, info, message: 'Logged in'})
            } else {
                res.status(401).json({message: "Invalid credentials"})
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err);
        })
    } else {
        res.status(400).json({message: "Please give a username and password"})
    }
})

// Middleware to restrict access
function restricted(req, res, next) {
    if (req.session && req.session.user) {
        next();
    } else {
        res.status(401).json({message: "You shall not pass!"})
    }
}

// GET users endpoint 
server.get('/api/users', restricted, (req, res) => {
    Users.find()
    .then(users => {
        res.json(users);
    })
    .catch(err => res.send(err));
})

// GET endpoint to logout
server.get('/api/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                console.log(err)
            } else {
                res.send('Goodbye!')
            }
        })
    } else {
        res.end();
    }
})
   
module.exports = server;
