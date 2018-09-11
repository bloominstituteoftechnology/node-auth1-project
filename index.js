const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session');

const db = require('./database/dbConfig.js');

const server = express();
const sessionConfig = {
    name: 'salamander', // default is connect.sid
    secret: 'all your base are belong to us',
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000, // a day
      secure: false, // only set cookies over https. Server will not send back a cookie over http.
    }, // 1 day in milliseconds
    httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
    resave: false,
    saveUninitialized: false,
    // store: new KnexSessionStore({
    //   tablename: 'sessions',
    //   sidfieldname: 'sid',
    //   knex: db,
    //   createtable: true,
    //   clearInterval: 1000 * 60 * 60,
    // }),
};

server.use(session(sessionConfig));

server.use(express.json());
server.use(cors());

function protected(req, res, next) {
    if (req.session && req.session.username) {
      next();
    } else {
      res.status(401).json({ message: 'you shall not pass!!' });
    }
}

// Endpoints 
server.get('/', (req, res) => {
  res.send('Server online');
});

server.post('/api/register', (req, res) => {
    // grab creds
    const creds = req.body;

    // hash the password
    const hash = bcrypt.hashSync(creds.password, 9);

    // replace user's password with the hash
    creds.password = hash;

    // save the user
    db('users')
        .insert(creds)
        .then(ids => {
            const id = ids[0];

            res.status(201).json(id);
        })
        .catch(err => res.status(500).send(err));
});

server.post('/api/login', (req, res) => {
    const creds = req.body;

    // find the user
    db('users')
        .where({ username: creds.username })
        .first()
        .then(user => {
            // check creds
            if (user && bcrypt.compareSync(creds.password, user.password)) {
                req.session.username = user.username;
                res.status(200).send(`Willkommen zu Ihrem Trainingstag ${req.session.username}` );
            } else {
                res.status(401).json({ message: 'You shall not pass...' });
            }
        })
        .catch(err => res.status(500).send(err));
});

// protect this route, only authenticated users should see it
server.get('/api/users', protected, (req, res) => {
  db('users')
    .select('id', 'username', 'password')
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

server.listen(3600, () => console.log('\nrunning on port 3600\n'));
