const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');

const session = require('express-session');

const db = require('./data/db')

const server = express();

server.use(express.json());
server.use(morgan('dev'));
server.use(helmet());

server.use(
    session({
        name: 'notsession', // default is connect.sid
        secret: 'da password',
        cookie: {
            maxAge: 1 * 24 * 60 * 60 * 1000,
            secure: false, // only set cookies over https. Server will not send back a cookie over http.
        }, // 1 day in milliseconds
        httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
        resave: false,
        saveUninitialized: true,
    })
);

function protected(req, res, next) {
    if (req.session) {
        next();
    } else {
        return res.status(401).json({ error: 'Incorrect credentials' });
    }
}

server.get('/api/users', protected, (req, res) => {
    if (req.session) {
        db("users")
            .then(users => {
                return res.status(200).json(users);
            })
            .catch(err => {
                return res.status(500).json(err);
            });
    }
    else {
        res.status(500).json('You shall not pass!')
    }
});

server.post('/api/register', (req, res) => {
    const user = req.body;

    const hash = bcrypt.hashSync(user.password, 14);

    user.password = hash;

    db('users')
        .insert(user)
        .then(response => {
            return res.status(200).json({ Message: "Success!" })
        })
        .catch(err => {
            return res.status(500).json(err);
        })
})

server.post('/api/login', (req, res) => {
    const credentials = req.body;

    db("users")
        .where({ username: credentials.username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(credentials.password, user.password)) {
                req.session.username = credentials.username;
                return res.send(`Hello ${credentials.username}! you are logged in`);
            } else {
                return res.status(501).json({ message: "Bad credentials" });
            }
        })
        .catch(err => {
            res.status(500).json(err);
        });
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

server.listen(8000, () => console.log('API running on port 8000... *.*'));