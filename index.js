const express = require('express');
const helmet = require('helmet');
const knex = require('knex');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);


const knexConfig = require('./knexfile.js');
const db = knex(knexConfig.development);

const server = express();

const sessionConfig = {
    secret: 'SECRET!!!',
    name: 'monkey',
    httpOnly: true,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 10
    },
    store: new KnexSessionStore({
        tablename: 'sessions',
        sidfieldname: 'sid',
        knex: db,
        createtable: true,
        clearInterval: 1000 * 60 * 60
    })
};
server.use(session(sessionConfig));

server.use(express.json());
server.use(helmet());

server.get('/', (req, res) => {
  res.send('***THIS SERVER IS RUNNING***')
});

server.post('/register', (req, res) => {
    const credentials = req.body;
    const hash = bcrypt.hashSync(credentials.password, 14);
    credentials.password = hash;
    db('users')
    .insert(credentials)
    .then(ids => {
        const id = ids[0];
        req.session.userId = id;
        res.status(201).json({ newUserId: id});
    })
    .catch(err => {
        res.status(500).json(err);
    });
});

server.post('/login', (req,res) => {
    const creds = req.body;
    db('users').where({username: creds.username}).first()
    .then(user => {
        if(user && bcrypt.compareSync(creds.password, user.password)) {
            req.session.userId = user.id;
            res.status(200).json({welcome: user.username})
        } else {
            res.status(401).json({ message: 'you shall not pass!'});
        }
    })
    .catch(err => {
        res.status(500).json(err);
    });
});

server.get('/logout', (req, res) => {
    if(req.session) {
        req.session.destroy(err => {
            if(err) {
                res.send('You can\'t leave');
            } else {
                res.send('good buy');
            }
        })
    }
});

server.get('/users', protected, (req, res) => {
        db('users')
        .select('id', 'username', 'password')
        .then(users => {
            res.json({userId: req.session.userId, users});
        })
        .catch(err => res.send(err));
    
});

function protected(req, res, next) {
    if(req.session && req.session.userId) {
       next();
    } else {
        res.status(401).json({message: 'Not Authorized'});
    }   
}


const port = 5000;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});