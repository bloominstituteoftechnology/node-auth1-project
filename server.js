const express = require('express');
const helmet = require('helmet');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex');

const bcrypt = require('bcryptjs');

const db = require('./data/dbConfig.js');
const Users = require('./users/users-model.js');

const server = express();

const sessionConfig = {
    name: 'bandit',
    secret: 'tuxedo cat',
    cookie: {
        maxAge: 1000 * 60 * 30,
        secure: false,  //only false for dev
    },
    httpOnly: true,
    resave: false,
    saveUninitialized: false,

    // store: new KnexSessionStore({
    //     knex: db,
    //     tablename: 'userSessions',
    //     sidfieldname: 'sid',
    //     createtable: true,
    //     clearInterval: 1000 * 60 * 60,
    //     
    // }),
};

server.use(helmet());
server.use(express.json());
server.use(session(sessionConfig));


server.get('/', (req, res) => {
    res.send("We did the mash ---- we did the Monster Mash!");
});

//user is able to register with a username and password
server.post('/api/register', (req, res) => {
    let user = req.body;

    const hash = bcrypt.hashSync(user.password, 12);

    user.password = hash;

    Users.add(user)
      .then(saved => {
          res.status(201).json(saved);
      })
      .catch(error => {
          res.status(500).json(error);
      });
});


//user is able to login with a previously created username and password
server.post('/api/login', (req, res) => {
    let {username, password} = req.body;

    Users.findBy({username})
      .first()
      .then(user => {
          if (user && bcrypt.compareSync(password, user.password)) {
              //use cookies on Tuesday to create a new session upon login
              res.status(200).json({message: `Welcome ${user.username}!`});
          } else {
              res.status(401).json({message: 'You shall not pass!'});
          }
      })
      .catch(error => {
          res.status(500).json(error);
      });
});


//middleware that restricts a users access if they are not logged in/authorized
function restricted(req, res, next) {
    const {username, password} = req.headers;

    if (username && password) {
        Users.findBy({username})
          .first()
          .then(user => {
              if (user && bcrypt.compareSync(password, user.password)) {
                  next();
              } else {
                  res.status(401).json({message: 'You shall not pass!'});
              }
          })
          .catch(error => {
              res.status(500).json({message: 'An error has occurred.'});
          });
    } else {
        res.status(400).json({message: 'Please provide a username and password.'});
    }
}


//if a user is authorized they will be able to view the list of users
server.get('/api/users', restricted, (req, res) => {
    Users.find()
      .then(users => {
          res.json(users);
      })
      .catch(error => res.send(error));
});

module.exports = server;