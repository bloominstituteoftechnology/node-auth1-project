// imports
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcryptjs')
const logger = require('morgan');
const db = require('./database/config.js');

// server + middleware
const server = express();
server.use(express.json());
server.use(helmet());
server.use(cors());
server.use(logger('dev'));

// API status
server.get('/', (req, res) => {
    res.send({API: "live"})
})

// user registration endpoint
server.post('/api/register', (req, res) => {
    const creds = req.body; // grab username and pw from body
    const hash = bcrypt.hashSync(creds.password, 14); // generate hash from user's pw
    creds.password = hash;

    db('users').insert(creds).then(ids => {
      res.status(201).json(ids);
    }).catch(err => res.send(err));
})

// user login endpoint
server.post('/api/login', (req, res) => {
    const creds = req.body;
    db('users').where({username: creds.username}).first().then(user => {
      // user exists and pws match
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        res.status(200).json({message: "Logged In"});
      } else {
        res.status(401).json({message: "You shall not pass!"});
      }
    }).catch(err => res.send(err));
})

// protect this route, only authenticated users should see it
server.get('/api/users', (req, res) => {
    db('users')
      .select('id', 'username')
      .then(users => {
        res.json(users);
      })
      .catch(err => res.send(err));
});

// server listening on dynamic port
const port = process.env.PORT || 9000;
server.listen(port, () => console.log(`Server listening on ${port}`));