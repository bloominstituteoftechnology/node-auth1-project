const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session');
// require the session store
const KnexSessionStore = require('connect-session-knex')(session)

const db = require('./database/dbConfig');

const server = express();

// session middleware
const sessionConfig = {
    name: 'tomahawk', // default is connect.sid
    secret: 'correct horse battery staple',
    cookie: {
        maxAge: 1 * 24 * 60 * 60 * 1000, // a day in milliseconds
        secure: false, // only set cookies over https. server will not send back a cookie over http
    },
    httpOnly: true, // don't let JS code access cookies. browser extensions run JS code in your browser!
    resave: false,
    saveUninitialized: false,
    store: new KnexSessionStore({
        tablename: 'sessions',
        sidfieldname: 'sid',
        knex: db,
        createTable: true,
        clearInterval: 1000 * 60 * 60,
    }),
}

server.use(session(sessionConfig));

server.use(express.json());
server.use(cors());

// protecting /api/users if not logged in
function protected(req, res, next) {
    if (req.session && req.session.username) {
        next();
    } else {
        res.status(401).json({errorMessage: 'You shall not pass!'});
    }
}

// global middleware for stretch
server.use('/api/restricted', function(req, res, next) {
    if (req.session && req.session.username) {
        next();
    } else {
        res.status(401).json({errorMessage: 'You are not authorized to see this restricted content.'});
    }
})

// endpoints

server.post('/api/register', (req, res) => {
    // grab creds
    const creds = req.body;

    // hash the password
    const hash = bcrypt.hashSync(creds.password, 10);

    // replace the user password with the hash
    creds.password = hash;

    db('users')
        .insert(creds)
        .then(ids => {
            const id = ids[0];

            res.status(201).json(id)
        })
        .catch(err => res.status(500).json(err));
})

server.post('/api/login', (req, res) => {
    // grab creds
    const creds = req.body;

    // find the user
    db('users')
        .where({username: creds.username})
        .first()
        .then(user => {
            // check creds
            if (user && bcrypt.compareSync(creds.password, user.password)) {
                // grab roles for user
                // req.session.roles = roles
                req.session.username = user.username;

                res.status(200).send(`Welcome, ${req.session.username}!`);
            } else {
                res.status(401).json({errorMessage: 'You shall not pass!'});
            }
        })
        .catch(err => res.status(500).json(err));
})

server.get('/api/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                res.send('error logging out');
            } else {
                res.send('good bye')
            }
        });
    }
});

// protect this route, only authenticated users should see it
server.get('/api/users', protected, (req, res) => {
    db('users')
        .select('id', 'username', 'password')
        .then(users => {
            res.json(users);
        })
        .catch(err => res.status(500).json(err));
})

server.get('/api/restricted', (req, res) => {
    res.send('You got in.');
})

server.get('/api/restricted/other', (req, res) => {
    res.send('You got in.');
})

server.listen(5000, console.log('\n-=- Server listening on port 5000 -=-\n'));