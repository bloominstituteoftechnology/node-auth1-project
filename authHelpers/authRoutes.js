const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');


const db = require('../data/dbConfig.js');

const router = express.Router();

const sessionConfig = {
  secret: 'nobody-tosses.a%dwarf.!',
  name: 'user-session',
  httpOnly: true,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 1
  },
};

router.use(session(sessionConfig));

// register a new user
router.post('/register', isAuthenticated, (req, res) => {
    const credentials = req.body;
  
    // hash the password
    const hash = bcrypt.hashSync(credentials.password, 14);
    credentials.password = hash;

    // then save the user.
    db('users')
      .insert(credentials)
      .then(ids => {
        const id = ids[0];
        req.session.username = user.username;
        res.status(201).json({ newUserId: id });
      })
      .catch(err => {
        res.status(500).json(err);
      });
});

router.post('/login', (req, res) => {
    const creds = req.body;
    db('users')
      .where({ username: creds.username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(creds.password, user.password)) {
            req.session.username = user.username;
            // found the user.
            res.status(200).json({ welcome: user.username });
        } else {
            res.status(401).json({
            message: `You shall not pass... as you are not authenticated.`,
          });
        }
      })
      .catch(err => {
        res.status(500).json(err);
      });
});

router.get('/logout', isAuthenticated, (req, res) => {
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

// protect this route, only authenticated users should see it
router.get('/users', isAuthenticated, (req, res) => {
    db('users')
    .select('id', 'username', 'password')
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

// function protected(req, res, next) {
//     if(req.session && req.session.username) {
//         next();
//     } else {
//         res.status(401).json({ message: 'Not Authorized' });
//     }
// }

function isAuthenticated(req, res, next) {
  if(req.session && req.session.username) {
      next();
  } else {
      res.status(401).json({ message: 'Not Authorized' });
  }
}


module.exports = router;