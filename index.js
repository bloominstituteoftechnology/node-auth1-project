const express = require('express');
const knex = require('knex');
const bcrypt = require('bcryptjs');
const session = require('express-session');

const dbConfig = require('./knexfile');

const db = knex(dbConfig.development);

const server = express();

server.use(express.json());

server.use(
    session({
      name: 'notsession', // default is connect.sid
      secret: 'nobody tosses a dwarf!',
      cookie: {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        secure: false, // only set cookies over https. Server will not send back a cookie over http.
      }, // 1 day in milliseconds
      httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
      resave: false,
      saveUninitialized: false,
    })
  );

server.get('/', (req, res) => {
    res.send('API Running...');
});

server.post('/api/register', (req, res) => {
    const credentials = req.body;

    const hash = bcrypt.hashSync(credentials.password, 3);

    credentials.password = hash;

    db('users').insert(credentials).then(ids => {
        const id = ids[0];

        res.status(200).json(id);
    }).catch(err => res.status(500).send(err));
});

server.post('/api/login', (req, res) => {
    const credentials = req.body;

    db('users').where({username: credentials.username}).first().then(user => {
        if(user && bcrypt.compareSync(credentials.password, user.password)){
            req.session.username = user.username;
            res.status(200).send(`Welcome ${req.session.username}`);
        } else {
            res.status(401).json({message: 'You shall not pass!'});
        }
    }).catch(err => res.status(500).send(err));
});

server.get('/api/users', (req, res) => {
    
    if (req.session && req.session.username) {
        db('users')
        .then(user => {
            res.status(200).json(user);
        })
        .catch(err => res.status(500).send(err));
    }
    else {
        res.status(401).json({message: 'You shall not pass!'});
    }
});


server.listen(8000);