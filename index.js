const express = require('express');
const logger = require('morgan');
const helmet = require('helmet');
const dbhelper = require('./dbhelper')
const bcrypt = require('bcryptjs');
const session = require('express-session');

const server = express();
const PORT = 4000;

server.disable("etag");
server.use(express.json());
server.use(helmet());
server.use(logger('dev'));
server.use(session({
    name: 'newsession', // default is connect.sid
    secret: 'secretsecretsecretsecret',
    cookie: {
        maxAge: 1 * 24 * 60 * 60 * 1000
    }, // 1 day in milliseconds
    httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
    resave: false,
    saveUninitialized: false,
}));


server.post('/api/register', (req, res) => {
    const newUser = req.body;
    console.log(newUser)
    if (!newUser.password || !newUser.username) {
        return res
            .status(412)
            .json('Please provide Username and/or password')
    }
    newUser.password = bcrypt.hashSync(newUser.password, 14);
    dbhelper.registerUser(newUser)
        .then(id => {
            res
                .status(201)
                .json(id)
        })
        .catch(err => {
            res
                .status(500)
                .json(err)
        })
})

server.post('/api/login', (req, res) => {
    const bodyUser = req.body;
    if (!bodyUser.password || !bodyUser.username) {
        return res
            .status(404)
            .json('Please provide Username and/or password')
    }
    dbhelper.findByUser(bodyUser.username)
        .then(user => {
            if (user.length && bcrypt.compareSync(bodyUser.password, user[0].password)) {
                req.session.userID = user[0].id;
                res
                    .json({ message: 'Logged In!' })
            } else {
                res
                    .json({ message: 'You shall not pass!' })
            }
        })
        .catch(error => {
            res
                .status(500)
                .json(error)
        })
})

server.get('/api/users', (req, res) => {
    if (req.session && req.session.userID) {
        dbhelper.findUsers()
            .then(users => {
                res
                .json(users)
            })
            .catch(err => res.send(err));
    } else {
        res
        .status(403)
        .send('You shall not pass!');
    }
});

server.listen(PORT, err => {
    if (err) console.log(err);
    console.log(`server is listening on port ${PORT}`);
});