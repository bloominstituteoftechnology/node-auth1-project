const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session');

const db = require('./database/dbConfig.js');

const server = express();
const sessionConfig = {
    name: 'notsession', // default is connect.sid
    secret: 'nobody tosses a dwarf!',
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000,
      secure: false, // only set cookies over https. Server will not send back a cookie over http.
    }, // 1 day in milliseconds
    httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
    resave: false,
    saveUninitialized: false,
  };

server.use(session(sessionConfig));
server.use(express.json());
server.use(cors());

//middleware
function protected(req, res, next) {
    if (req.session && req.session.username) {
      next();
    } else {
      res.status(401).json({ message: 'you shall not pass!!' });
    }
  };

server.get('/', (req, res) => {
    res.send('Server running...');
});

server.post('/api/register', (req, res) => {
    const creds = req.body;
    const hash = bcrypt.hashSync(creds.password, 10);
    creds.password = hash;
    db('users')
    .insert(creds)
    .then(ids => {
        const id = ids[0];
        res.status(201).json(id);
    })
    .catch(err => res.status(500).send(err));
});

server.post('/api/login', (req, res) => {
    if (req.session.username) {
        res.status(400).json({ message: 'Please log out of open accounts before logging in a new user' });
    } else {
        const creds = req.body;
        db('users')
        .where({ username: creds.username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(creds.password, user.password)) {
                req.session.username = user.username;
                req.session.role = user.role;
                res.status(200).send(`Welcome ${req.session.username}`);
            } else {
                res.status(401).json({ message: 'You are not authorized.' });
            }
        })
        .catch(err => res.status(500).send(err));
    }
});

server.get('/api/logout', (req, res) => {
    if (req.session) {
      req.session.destroy(err => {
        if (err) {
          res.send('error logging out');
        } else {
          res.send('good bye');
        }
      });
    }
  });

server.get('/api/users', protected, (req, res) => {
    const {username} = req.session;
    db('users')
    .where({username: username})
    .select('id', 'username', 'role')
    .then(user => {
        res.json(user);
    })
    .catch(err => res.send(err));
});

server.get('/api/admins', protected, (req, res) => {
    if (req.session.role === 'admin') {
      db('users')
        .select('id', 'username', 'password', 'role')
        .then(users => {
          res.json(users);
        })
        .catch(err => res.send(err));
    } else {
      res.status(403).json({ message: 'You do not have access to this resource' });
    }
  });


server.listen(8000, () => console.log('\nrunning on port 8000\n'));