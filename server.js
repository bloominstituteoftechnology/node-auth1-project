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
// middleware

const sessionConfig = {
    secret: 'text',
    cookie: {
        maxAge: 1000 * 60 * 60
    },
    httpOnly: true,
    secure: false,
    resave: true,
    saveUninitialized: false,
    name: 'noname'
}

server.use(session(sessionConfig),
    (req, res, next) => {
        console.log('Session was created!', req.session);
        next();
    }
);



server.use(express.json());

server.get('/', (req, res) => {
    if (req.sessions && req.session.username) {
        res.status(200).json({ message: `welcome back ${req.session.username}` })
    } else {
        res.status(401).json({ message: 'speak friend and enter' })
    }
})



function cookieMonster(req, res, next) {
    if (req.session && req.session.username) {
        next()
    } else {
        res.status(401).json('please log in');
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
            res.json(user);
        }).catch(err => {
            res.json(err)
        })
})

server.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    User.findOne({ username })
        .then(user => {
            if (user) {
                user.validatePassword(password)
                    .then(passwordsMatch => {
                        if (passwordsMatch) {
                            req.session.username = user.username;
                            res.send('have a cookie');
                        } else {
                            res.send('invalid credentials');
                        }
                    })
                    .catch(err => {
                        res.status(401).send('error comparing passwords')
                    })
            }
            else {
                res.status(401).send('invalid credentials');
            }
        })
        .catch(err => {
            res.send(err);
        })

})


server.get('/api/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                res.send('error logging out');
            } else {
                res.send('goodbye')
            }
        })
    }
});
// const vipRoutes = (req, res) => {
//     res.status(200).json('Yipee we are VIP');
// }
server.listen(8000, () => {
    console.log('\n*** API running on port 8k***\n')
})