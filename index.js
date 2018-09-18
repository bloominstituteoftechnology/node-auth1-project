const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const db = require('./dbConfig.js');

const server = express();

const sessionConfig = {
    name: 'kitty', // default is connect.sid
    secret: 'meow and meow!',
    cookie: {
        maxAge: 1 * 24 * 60 * 60 * 1000, // a day
        secure: false, // only set cookies over https. Server will not send back a cookie over http.
    }, // 1 day in milliseconds
    httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
    resave: false,
    saveUninitialized: false,
    store: new KnexSessionStore({
        tablename: 'sessions',
        sidfieldname: 'sid',
        knex: db,
        createtable: true,
        clearInterval: 1000 * 60 * 60,
    }),
};

server.use(session(sessionConfig));

server.use(express.json());
server.use(helmet());
server.use(cors());

function protected(req, res, next) {
    if (req.session && req.session.username) {
        next();
    } else {
        res.status(401).json({message: 'sorry, no can do!'});
    }
}

// endpoints

server.get('/', (req, res) => {
    res.send('Abracdabra!');
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
        // .catch(err => res.status(500).send(err))
        .catch(err => {
            console.log('/api/register POST ERROR:', err);
            res.status(500).send(err);
        })
});

server.post('/api/login', (req, res) => {
    const creds = req.body;

    db('users')
        .where({
            username: creds.username
        })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(creds.password, user.password)) {
                res.send(200).send('Welcome');
            } else {
                res.status(401).json({
                    message: 'incorrect credentials'
                });
            }
        })
        .catch(err => {
            console.log('/api/login POST ERROR:', err)
            res.status(500).send(err)
        })
    });

server.get('/api/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                res.send('error logging out');
            } else {
                res.send('see you later!');
            }
        });
    }
});



server.get('/api/users', protected, (req, res) => {
    db('users')
        .select('id', 'username', 'password')
        .then(users => {
            res.json(users);
        })
        .catch(err => {
            console.log('/api/users GET ERROR:', err)
            res.send(err)
        });
});





server.listen(6600, () => console.log('\nrunning on port 6600\n'));