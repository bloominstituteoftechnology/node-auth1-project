const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');

const db = require('./data/db');

const server = express();

function protected(req, res, next) {
    if (req.session && req.session.username === 'user') {
      next();
    } else {
      return res.status(401).json({ error: 'Incorrect credentials' });
    }
}

function roles(req, res, next) {
    return function(roles) {
      if (req.session && req.session.username === 'user') {
        next();
      } else {
        return res.status(401).json({ error: 'Incorrect credentials' });
      }
    };
}

server.use(
    session({
      name: 'notsession', 
      secret: 'nobody tosses a dwarf!',
      cookie: {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        secure: false, 
      }, 
      httpOnly: true, 
      resave: false,
      saveUninitialized: true,
    })
);

server.use(express.json());

server.get('/', (req, res) => {
    res.send("Api Running")
})

server.get('/users', (req, res) => {
    db('users')
        .then(response => {
            res.status(200).json(response)
        })
        .catch(err => {
            res.status(500).json(err)
        })
})

server.post('/register', (req, res) => {
    const credentials = req.body;
    const hash = bcrypt.hashSync(credentials.password, 14);
    credentials.password = hash;
    if(!(credentials.user || credentials.password)) {
        res.status(400).json({ error: 'Enter username and password.' })
    } else {
        db('users')
            .insert(credentials)
            .then(response => {
                res.status(200).json(response)
            })
            .catch(err => {
                res.status(500).json(err)
            })
    }
})

server.post('/login', function(req, res) {
    const credentials = req.body;

    db('users')
        .where({ username: credentials.username })
        .first()
        .then(function(user) {
            if (user && bcrypt.compareSync(credentials.password, user.password)) {
              req.session.username = user.username;
              res.send(`welcome ${user.username}`);
            } else {
              return res.status(401).json({ error: 'Incorrect credentials' });
            }
        })
        .catch(function(error) {
            res.status(500).json({ error });
    });
});

server.get('/logout', (req, res) => {
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

const port = 8000;
server.listen(port, () => console.log(`\n=== API running on ${port} ===\n`)); 