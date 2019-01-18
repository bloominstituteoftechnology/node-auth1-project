const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');

const db = require('./data/dbHelpers.js');

const server = express();
const PORT = 4400;

server.use(express.json());

server.use(session({
    name: 'notsession', 
    secret: 'secret verbiage',
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000
    }, 
    httpOnly: true,
    resave: false,
    saveUninitialized: false,
}));
  

// register new user with hashed password

server.post('/api/register', (req, res) => {
    const user = req.body;
    user.password = bcrypt.hashSync(user.password, 14);
    if (user.password && user.username) {
        db
        .insert(user)
        .then(id => {
            res
                .status(201)
                .json({id: id[0]})
        })
        .catch(err => {
            res
                .status(500)
                .json({message: `Registration could not be completed at this time.`})
        });
    }
    else {
        res
            .status(400)
            .json({message: `Please provide both a username and password for registration.`})
    }
});

// log in with hashed password

server.post('/api/login', (req, res) => {
    const user = req.body;
    if (user.password && user.username) {
        db.findByUsername(user.username)
            .then(users => {
                if (users.length && bcrypt.compareSync(user.password, users[0].password)) {
                    res.json({message: `Logged in.`});
                }
                else {
                    res
                        .status(404)
                        .json({message: `You shall not pass!`});
                }
            })
            .catch(err => {
                res
                    .status(500)
                    .send({message: `Log in could not be completed at this time.`});
            });
    }
    else {
        res
            .status(400)
            .send({message: `Please provide both a username and password to log in.`});
    }
});

server.listen(PORT, () => console.log(`Running on ${PORT}`));