const express = require('express');
const cors = require('cors');

const bcrypt = require('bcryptjs');

const db = require('./database/dbConfig.js');

const server = express();

const session = require('express-session');

function protected(req, res, next) {
    if (req.session && req.session.username) {
        next();
    } else {
        res.status(401).json({ message: 'You shall not pass!' });
    }
}

server.use(express.json());
server.use(cors());

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
      saveUninitialized: true,
    })
  );

server.get('/', (req, res) => {
    res.send("It's allliiiiive!!!");
});

server.post('/api/login', (req, res) => {
    const creds = req.body;

    db('users')
    .where({username: creds.username})
    .first()
    .then(user => {
        if(user && bcrypt.compareSync(creds.password, user.password)) {
            req.session.username = user.username;
            res.status(200).json({ message: `Logged in` });
        } else {
            res.status(401).json({ message: "You shall not pass!"});
        }
    })
    .catch(err => res.status(500).json({err}));
})

server.post('/api/register', (req, res) => {
    const credentials = req.body;

    // hash password
    const hash = bcrypt.hashSync(credentials.password, 14);
    credentials.password = hash;
    // save user
    db('users').insert(credentials).then(ids => {
        const id = ids[0];
        res.status(201).json({ newUserId: id });
    })
    .catch(err => {
        res.status(500).json({err});
    })
})

// this endpoint needs to be protected, only auth'd users should see it
server.get('/api/users', protected, (req, res) => {
    db('users')
      .select('id', 'username')
      .then(users => {
        res.json(users);
      })
      .catch(err => res.send(err));
  });

const port = 8888;
server.listen(port, () => console.log(`API running on ${port}`));