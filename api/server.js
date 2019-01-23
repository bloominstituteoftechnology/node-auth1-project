const express = require('express');
const helmet = require('helmet');
const knex = require('knex');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const KnexSessioniStore = require('connect-session-knex')(session);
const server = express();
const knexConfig = require('../knexfile.js');
const db = knex(knexConfig.development);


const sessionConfig = {
      name: 'userSession',
      secret: 'secretStuff',
      cookie: {
            maxAge: 1000 * 60 * 10,
            secure: false //should be true in production
      },
      httpOnly: true, //js can't touch this cookie
      resave: false,
      saveUninitialized: false,
      store: new KnexSessioniStore({
            tablename: 'sessions',
            sidfieldname: 'sid',
            knex: db,
            creattable: true,
            clearInterval: 1000 * 60 * 10,

      })
}



server.use(helmet());
server.use(express.json());
server.use(session(sessionConfig));


server.post('/register', (req, res) => {
      const userInfo = req.body;
    
      const hash = bcrypt.hashSync(userInfo.password, 12);

      userInfo.password = hash;
    
      db('users')
        .insert(userInfo)
        .then(ids => {
            res.status(201).json(ids)
      }).catch(err => res.status(500).json(err))
});

function protected(req, res, next) {
      if(req.session && req.session.user) {
            next();
      } else {
            res.status(401).json({ message: 'you shall not pass, not authenticated'});
      }
}

server.get('/users', protected, async (req, res) => {
      const users = await db('users');

      res.status(200).json(users);
});  

server.post('/login', (req, res) => {
      const creds = req.body;

      db('users')
        .where({ username: creds.username })
        .first()
        .then(user => {
             if (user && bcrypt.compareSync(creds.password, user.password)) {
                  req.session.user= user;
                  res.status(200).json({ message: `welcome ${user.name}`})
             } else {
                  res.status(401).json({ you: 'shall not pass!!'});
             }
        }).catch(err => res.status(500).json({ you: 'getting sent to .catch when i enter correct creds'}))

});

server.get('/logout', (req, res) => {
      if(req.session) {
            req.session.destroy(err => {
                  if(err) {
                        res.status(500).send('you can never leave');
                  } else {
                        res.status(200).send('bye bye');
                  }
            });
      } else {
            res.json({ message: 'logged out already'})
      }
})

module.exports = server;