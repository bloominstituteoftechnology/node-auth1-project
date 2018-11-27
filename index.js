const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const db = require('./database/dbConfig.js');
const server = express();
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const sessionConfig = {
    secret: 'abc123',
    name: 'cookie-monster',
    httpOnly: true,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000*60*1,
    },
    store: new KnexSessionStore({ 
        tablename: 'sessions', 
        sidfieldname: 'sid',
        knex: db,
        createtable: true,
        clearInterval: 1000*60*60,
    })
};
server.use(session(sessionConfig));  //wires up session mgmt

server.use(express.json());
server.use(cors());

server.post('/api/register', (req, res) => {
    const creds = req.body;
    const hash = bcrypt.hashSync(creds.password, 4);
    creds.password = hash;
    db('users')
        .insert(creds)
        .then(ids => {
            res.status(201).json(ids);
        })
        .catch(err => json(err));
});

server.post('api/login', (req, res) => {
    const creds = req.body;
    db('users')
        .where({ username: creds.username })
        .first()
        .then(user => {
            if(user && bcrypt.compareSync(creds.password, user.password)) {
                req.session.username = user.username;   
                res.status(200).json({ message: 'Logged in'})
            } else {
                res.status(401).json({ message: 'You shall not pass!' })
            }
        })
        .catch(err => json(err));
});

server.get('/api/users', protected, (req, res) =>{
    db('users')
        .select('id', 'username', 'password')
        //.where({ id: req.session.user })
        .then(users => {
            res.json('users')
        })
        .catch(err => json(err));
});

function protected(req, res, next) {
        //reads cookie header
        //theyre logged in so give access
    if (req.session && req.session.username) {
        //add session for every user that logs in and record name or id
        next();
    } else {
        res.status(401).json({ message: 'You shall not pass!' })
    }
};

server.get('/api/logout', (req, res) => {
    if(req.session) {
        req.session.destroy(err => {
            if(err) {
            res.send('you can never leave');
            } else {
            res.send('bye');
            }
        })
    } else {
        res.end();
    }
});

server.listen(8000, () => console.log('Running on port 8000'));
