const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session');

const db = require('./database/dbConfig.js');

const server = express();
const sessionConfig = {
  name: 'monkey', // default is connect.sid
  secret: 'nobody tosses a dwarf!',
  cookie: {
    maxAge: 1 * 24 * 60 * 60 * 1000, // a day
    secure: false, // only set cookies over https. Server will not send back a cookie over http.
  }, // 1 day in milliseconds
  httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
  resave: false, // forces session to be saved back to the session store
  saveUninitialized: false, // forces a session that is "uninitialized" to be saved to the store
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

server.get('/', (req, res) => {
  res.send('We are good to go.');
});

server.get('/api/users', protected, (req, res) => {
  db('users')
    .select('id', 'username')
    .then(users => res.status(200).json(users))
    .catch(err => res.status(500).json({ errorMsg: 'Could not get users.' }));
});

server.post('/api/register', (req, res) => {
  // grab credentials
  const creds = req.body;
  // hash the password
  const hash = bcrypt.hashSync(creds.password, 10);
  // replace the user password with the hash
  creds.password = hash;
  //save the user
  db('users')
    .insert(creds)
    .then(ids => {
      const id = ids[0];
      res.status(201).json(id);
    })
    .catch(err =>
      res.status(500).json({ errorMsg: 'Unable to register user.' })
    );
});

server.post('/api/login', (req, res) => {
    // grab credentials
    const creds = req.body;
    //find the user
    db('users')
    .where({ username: creds.username })
    .first()
    .then(user => {
        //check creds
        if(user && bcrypt.compareSync(creds.password, user.password)) {
            req.session.username = user.username;
            res.status(200).json({ message: `${req.session.username} Logged in` });
        }
        else {
            res.status(401).json({ message: 'You shall not pass!' })
        }
    })
    .catch(err => res.status(500).json({errorMsg: 'Could not login.' }))
})

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

server.listen(3300, () => console.log('\nrunning on port 3300\n'));
