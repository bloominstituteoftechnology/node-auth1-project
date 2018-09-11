const express = require('express');
const helmet = require('helmet');
const bcrypt = require('bcrypt');
const session = require('express-session');

const db = require('./db/dbConfig');

const server = express();

server.use(helmet());
server.use(express.json());

server.use(
    session({
        name: 'banana',
        secret: 'what up?',
        cookie: {
            maxAge: 1 * 24 * 60 * 60 * 1000,
            secure: true,
        },
        httpOnly: true,
        resave: false,
        saveUninitialized: false,
    })
);

// ####### Checking if the server is running #######
server.get('/', (req, res) => {
    res.send('API running....')
});

// ###### Getting all the users ########
server.get('/users', (req, res) => {
    db('users')
        .then(users => {
            res.status(200).json(users)
        })
        .catch(error => {
            res.status(500).json({Message: 'Can not get users!', error})
        })
})

// ######### Registering new user #############
server.post('/register', (req, res) => {
    const newUser = req.body;
    const hash = bcrypt.hashSync(newUser.password, 14);
    newUser.password = hash;

    db('users')
        .insert(newUser)
        .then(users => {
            res.status(200).json(users)
        })
        .catch(error => {
            res.status(500).json(error)
        })
})

// ########## User login ############
server.post('/login', (req, res) => {
    const creds = req.body;

    db('users')
        .where({username: creds.username})
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(creds.password, user.password)) {
                res.status(200).json({Message: 'You are logged in!!!'})
            } 
            else {
                return res.status(400).json({Message: 'Wrong credentials'})
            }
        })
        .catch(error => {
            res.status(500).json(error)
        })
})

server.get('/logout', (req, res) => {
    if (req.session) {
      req.session.destroy(err => {
        if (err) {
          res.send('Can not log out!!!!');
        } else {
          res.send('See you next time!!!');
        }
      });
    }
  });


server.listen(5000);