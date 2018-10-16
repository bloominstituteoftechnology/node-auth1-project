const bcrypt = require('bcryptjs');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const db = require('./data/dbConfig.js');

const port = 5000;
const server = express();

function protected(req, res, next) {
    if(req.session && req.session.username) {
        next();
    }else {
        res.status(401).json({message: 'Not Authorized!'});
    }
}

const sessionConfig = {
    secret: 'hopefully-this-is-going.well!',
    name: 'Apple',
    httpOnly: true,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 10,
    },
    store: new KnexSessionStore({
        tablename: 'session',
        sidfieldname: 'sid',
        knex: db,
        createtable: true,
        clearInterval: 1000 * 60 * 60
    }),
};

server.use(express.json());
server.use(cors());
server.use(helmet());
server.use(session(sessionConfig));

server.get('/', (req, res) => {
    res.send('Am I Alive?'); //Yes
});

server.post('/api/register', (req, res) => {
    const credentials = req.body;

    const hash = bcrypt.hashSync(credentials.password, 10);
    credentials.password = hash;

    db('users')
        .insert(credentials)
        .then(ids => {
            const id = ids[0];
            res.status(201).json({newUserId: id});
        })
        .catch(err => res.status(561).json(err))
});

server.post('/api/login', (req, res) => {
    const creds = req.body;

    db('users')
        .where({username: creds.username})
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(creds.password, user.password)) {
                req.session.username = user.username;
                res.status(200).json({welcome: user.username});
            }else {
                res.status(401).json({message: 'You Shall Not Pass!'})
            }
        })
        .catch(err => res.status(578).json(err))
});

server.get('/api/users', protected, (req, res) => {

    db('users')
      .select('id', 'username', 'password')
      .then(users => {
        res.json(users);
      })
      .catch(err => res.status(587).json(err))
    });
  

server.listen(port, () => console.log(`\n=== Listening on Port ${port} ===\n`));


