const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const morgan = require('morgan');

const db = require('./data/dbHelpers.js');
const server = express();
const PORT = 4500;

// custom middleware
function protect(req, res, next) {
    if (req.session && req.session.userId) {
      next();
    }
    else {
      res.status(400).send('You shall not pass!');
    }
  }

server.use(express.json());
server.use(cors());
server.use(morgan('dev'));
server.use(session({
    name: 'notsession', // default is connect.sid
    secret: 'nobody tosses a dwarf',
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000 // 1 day in milliseconds
    },
    httpOnly: true, // don't let JS code access cookies.  Browser extensions run JS code on your browser
    resave: false,
    saveUninitialized: false,
}));

server.post('/api/register', (req, res) => {
    const user = req.body;
    user.password = bcrypt.hashSync(user.password, 16);
    if (!user.username || !user.password || user.username === '' || !user.password === '') {
        res.status(400).json({ errorMessage: 'Please make sure you input your username and password.' });
    } else {
        db.insert(user)
            .then(ids => {
                res.status(201).json({ id: ids[0] });
            })
            .catch(err => {
                res.status(500).json({ errorMessage: 'Failed to create user.' });
            });
    };
});

server.post('/api/login', (req, res) => {
    const credentials = req.body;
    db.findByUsername(credentials.username)
    .then(users => {
        if (users.length && bcrypt.compareSync(credentials.password, users[0].password)) {
            req.session.userId = users[0].id;
            res.status(200).json({ status: 'Logged in' });
        } else {
            res.status(404).json({ errorMessage: 'You shall not pass!' });
        }
    })
    .catch(err => {
        res.status(500).json({ errorMessage: 'I iz broken. ' });
    });
});

server.get('/api/users', protect, (req, res) => {
    db.get()
    .then(users => {
        res.status(200).json(users);
    })
    .catch(err => {
        res.status(500).json({ errorMessage: 'Failed to get users' });
    });
});

server.post('/api/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            res.status(500).json({ errorMessage: 'Failed to Logout.' });
        } else {
            res.status(200).json({ errorMessage: 'Logout Successful.' });
        }
    });
});

server.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
});