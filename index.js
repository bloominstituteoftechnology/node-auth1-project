const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const db = require('./data/dbConfig.js');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const server = express();
const port = 9000; 

const sessionConfig = {
    secret: 'nobody.mess.with.this.session',
    name: 'mr.session',
    httpOnly: true,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60, //hour
    },
    store: new KnexSessionStore({
        tablename: 'sessions',
        sidfieldname: 'sid',
        knex: db,
        createtable: true,
        clearInterval: 1000 * 60 * 60, //hour, removes only expired sessions
    })
};

//globale middleware
server.use(session(sessionConfig));
server.use(cors());
server.use(express.json());

//Get users
server.get('/api/users', protected, (req, res) => {
        db('users')
            .select('id', 'username')
            .then(users => {
                console.log(req.session.userId);
                res.status(200).json(users);
            })
            .catch(err => res.status(500).json(err))
})

//Post create user 
server.post('/api/register', (req, res) => {
    const credentials = req.body;
    const hash = bcrypt.hashSync(credentials.password, 14);
    credentials.password = hash;

    db('users').insert(credentials).then(ids => {
        const id = ids[0];
        req.session.userId = id;
        res.status(201).json({ newUserId: id });
    }).catch(err => {
        res.status(500).json({ err });
    });
})

//Post check user
server.post('/api/login', (req, res) => {
    const credentials = req.body;

    db('users').where({username: credentials.username}).first().then(user => {
        if(user && bcrypt.compareSync(credentials.password, user.password)) {
            req.session.userId = user.id; //added for session
            res.status(200).json({message: 'Access granted'})
        } else {
            res.status(401).json({message: 'Invalid username and/or password'})
        }
    }).catch(err => res.status(500).json({err}));
})

server.get('/api/logout', (req, res) => {
    if(req.session) {
        req.session.destroy(err => {
            if(err) {
                res.send({message: err})
            } else {
                res.send({message: 'Goodbye'})
            }
        })
    }
})

//Get restricted
server.get('/api/restricted', protected, (req, res) => {
   
    db('missions')
        .select('description', 'notes')
        .where({user_id: req.session.userId})
        .then(missions => {
            res.status(200).json(missions);
        })
        .catch(err => res.status(500).json(err));
})

function protected(req, res, next) {
    if (req.session && req.session.userId) {
        next();
    } else {
        res.status(401).json({ message: 'Not Authorized' });
    }
} 

//listening
server.listen(port, () => console.log(`\nAPI running on http://localhost:${port}\n`));