const express = require('express');
const cors = require('cors');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const bcrypt = require('bcryptjs');

const knex = require('knex');
const knexConfig = require('./knexfile');

const db = knex(knexConfig.development);

const server = express();

const sessionConfig = {
    name: "whoknows",
    secret: "asfjaofuwruq04r3oj;ljg049fjq30j4jlajg40j40tjojasl;kjg",
    cookie: {
        maxAge: 1000 * 60 * 10,
        secure: false 
    },
    httpOnly: true, 
    resave: false,
    saveUninitialized: false,
    store: new KnexSessionStore({
        tablename: "sessions",
        sidfieldname: "sid",
        knex: db,
        createtable: true,
        clearInterval: 1000 * 60 * 60
    })
};
server.use(session(sessionConfig));
server.use(express.json());
server.use(cors());

server.post('/api/register', (req, res) => {
    const creds = req.body;
    const hash =  bcrypt.hashSync(creds.password, 8);
    creds.password = hash;

    db('users')
        .insert(creds)
        .then(ids => {
            res.status(201).json(ids);
        })
        .catch(error => {
            res.status(500).json(error)
        });
} )

server.post('/api/login', (req, res) => {
    const creds = req.body;

    db('users')
        .where({username: creds.username }).first()
        .then(user => {
            if(user && bcrypt.compareSync(creds.password, user.password)){

                res.status(200).json({ message: 'WELCOME!'})
            }else{
                res.status(401).json({ message: 'WRONG CREDENTIALS!!'})
            }
        })
        .catch(error => {
            res.status(500).json(error)
        })
})

server.get('/api/users', (req, res) => {
    db('users')
        .select('id', 'username', 'password')
        .then(users => {
            res.json(users);
        })
        .catch(err => res.send(err));
});


server.listen(8000, () => console.log('running on port 8000'));