const express = require('express');
const db = require('./database/dbHelper.js');

const server = express();
const bcrypt = require('bcryptjs');
const PORT = 4444;
const session = require('express-session');

function protect(req, res, next) {
   if (req.session && req.session.userId) {
    next();
} else {
    res.status(400).send('access denied');
    }
}

server.use(express.json());
server.use(session({
    name: 'notsession', // default is connect.sid
    secret: 'nobody tosses a dwarf!',
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000,
    //   secure: true, // only set cookies over https. Server will not send back a cookie over http.
    }, // 1 day in milliseconds
    httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
    resave: false,
    saveUninitialized: false,
}))

server.get('/', (req, res) => {
    res.send('Server is working!');
})

server.post('/api/register', (req, res) => {
    const user = req.body;
    user.password = bcrypt.hashSync(user.password, 10);
    db.insert(user)
    .then(ids => {
        res.status(201).json({id: ids[0]})
    })
    .catch(err => {
        res.status(500).send(err);
    })
})

server.post('/api/login', (req, res) => {
    const bodyUser = req.body;
    db.findByUsername(bodyUser.username)
    .then(users => {
        if (users.length && bcrypt.compareSync(bodyUser.password, users[0].password)) {
            req.session.userId = users[0].id
            res.json({ info: 'match'})
        } else {
            res.status(404).json({ err: 'Invalid username or password'})
        }
    })
    .catch(err => {
        res.status(500).send(err);
    })
})

server.get('/api/users', protect, (req, res) => {
    db.findUsers()
    .then(users => {
        res.json(users);
    })
    .catch(err => {
        res.status(500).send(err)
    })
})

server.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`)
})