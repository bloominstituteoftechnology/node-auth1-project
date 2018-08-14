const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');

const db = require('./database/dbConfig.js');

const server = express();

function protected (req, res, next) {
    if (req.session && req.session.username) {
      next();
    } else {
      res.status(401).json({ message: 'you shall not pass!!' });
    }
  };

server.use(express.json());

// configure express-session middleware
server.use(
  session({
    name: 'notsession', // default is connect.sid
    secret: 'nobody tosses a dwarf!',
    cookie: {
       maxAge: 1 * 24 * 60 * 60 * 1000, 
       secure: false,
    },
     // 1 day in milliseconds
    httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
    //secure: true, // only set cookies over https. Server will not send back a cookie over http.
     resave: false,
    saveUninitialized: true,
    //saveUninitialized: false,
  })
);

server.get('/', (req, res) => {
    res.send('We have liftoff!');
});

server.get('/setname', (req, res) => {
    req.session.name = 'Frodo';
    res.send('got it');
});

server.get('/getname', (req, res) => {
    const name = req.session.name;
    res.send('hello ${req.session.name}');
});



server.get('/users', (req, res) => {
    db('users')
    .then(users => {
        res.json(users);
    })
    .catch(err => res.send(err));
});

server.get('/users', protected, (req, res) => {
    db('users')
      .then(users => {
          res.json(users)
      })
      .catch(err => res.json(err));
  });

server.post('./register', function(req, res) {
    const user = req.body;

    const hash = bcrypt.hashSync(user.password, 14);
    user.password = hash;

    db('users')
    .insert(user)
    .then(function(ids) {
        db('users')
        .where({ id: ids[0] })
        .first()
        .then(user => {
            req.session.username = user.username;
            res.status(201).json(user);
        });
    })
    .catch(function(error) {
        res.status(500).json({ error });
    });
});

server.post('/login', function(req, res) {
    const credentials = req.body;

    db('users')
    .where({ username: credentials.username })
    .first()
    .then(function(users) {
        if (user && bcrypt.compareSync(credentials.password, user.password)) {
          req.session.username = user.username;
            res.send('welcome ${user.username}');
        } else {
            return res.status(401).json({ error: 'Incorrect credentials' });
        }
    })
    .catch((function(error) {
        res.status(500).json({ error });
    }));
});

server.get('/logout', (req, res) => {
    if(req.session) {
        req.session.destroy(err => {
            if (err) {
                res.send('error logging out, please try again');
            } else {
                res.send('goodbye, see you next time!')
            }
        });
    }
});

server.listen(3300, () => console.log('\n running on port 3300 \n'));