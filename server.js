const express = require('express');
const router = express.Router()
const server = express();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session')
const User = require('./auth/UserModel');

const vipRoutes = require('./vipRoutes')

mongoose.connect('mongodb://localhost/cs10').then(() => {
    console.log('\n*** Connected to the database***\n')
})


const sessionConfig = {
    secret: 'text',
    cookie: {
        maxAge: 1000 * 60 * 60
    },
    httpOnly: true,
    secure: false,
    resave: true,
    saveUninitialized: true,
    name: 'NAME'
}

server.use(session(sessionConfig),
(req, res, next) => {
    console.log('Session was created!', req.session);
    next();
}
);

server.use(express.json());

server.get('/', (req, res) => {
    res.status(200).json({ api: 'running...' })
})

const cookieMonster = (req, res, next) => {
    if (req.session && req.session.username) {
        next()
    } else {
        res.status(404).json('please log in');
    }
    next();
}
server.use('/api/vip', cookieMonster, vipRoutes)

server.post('/api/register', (req, res) => {
    // save the user to the database

    User.create(req.body).then(user => {
        res.status(201).json(user);
    }).catch(err => {
        res.status(500).json(err)
    });
})

server.get('/api/users', cookieMonster, (req, res) => {
    User.find()
        .then(user => {
            res.send(user);
        }).catch(err => {
            res.send(err)
        })
})

server.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    User.findOne({ username })
        .then(user => {
            if (user) {
                user.validatePassword(password)
                    .then(result => {
                        if (result) {
                            req.session.username = user.username
                            if (result) {
                                res.status(200).json({ msg: Authenticated })
                                result.validatePassword(password)
                            } else {
                                res.status(401).json({ err: "Please try again" })
                            }
                        }
                    })
                    .catch((err) => {
                        res.send({ innerErr: err })
                    })
            }
        })

})

// const vipRoutes = (req, res) => {
//     res.status(200).json('Yipee we are VIP');
// }
server.listen(8000, () => {
    console.log('\n*** API running on port 8k***\n')
})