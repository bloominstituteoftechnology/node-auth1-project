const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcrypt');
const db = require('./data/dbConfig.js');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const port = 8000;


const db = knex(knexConfig.development);

const server = express();

const sessionConfig = {
    secret: 'very.secret.session.stuff',
    name: 'ape',
    httpOnly: true,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60,
    },
    store: new KnexSessionStore({
        tablename: 'sessions',
        sidfieldname: 'sid',
        knex: db,
        createtable: true,
        clearInterval: 1000 * 60 * 60, 
    })
};


server.use(express.json(), cors(), helmet(), bcrypt(), session(sessionConfig));

server.get('/', (req, res) => {
    res.send('It lives!');
});

server.post('/api/register', (req, res) => {
    const credentials = req.body;
    const hash = bcrypt.hashSync(credentials.password, 12)
    credentials.password = hash;
    db('users')
        .insert(credentials)
        .then(ids => {
            res.status(201).json(ids[0])
        })
        .catch(err => {
            res.status(500).json(err)
        });
})

server.post('/api/login', (req, res) => {
    const credentials = req.body;
    db('users')
        .where({ username: credentials.username })
        .first()
        .then(user => {
            if ( user && bcrypt.compareSync(creds.password,user.password)) {
                req.session.user_id = user.username;
                res.status(200).send(`Hello, ${req.session.user_id} access granted.`)
            } else {
                res.status(401).send('Access denied')
            }            
        })
        .catch(err => {
            res.status(500).json(err)
        });
})

server.get('/api/users', (req, res) => {
    const name = req.session.user_id
    name !== undefined?
        db('users')
            .then(users => {
                res.status(200).json(users)
            })
            .catch(err => {
                res.status(500).json(err)
            }):
        res.status(403).send('Access denied')
})

server.listen(port, () => console.log(`API running on ${port} port.`))