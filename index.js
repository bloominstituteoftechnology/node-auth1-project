const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const db = require('./database/dbConfig.js');

const server = express();

server.use(express.json());
server.use(cors());

const port = 8000;

//GET user information
server.get('/users', (req, res) => {
    db('users')
      .select('id', 'username', 'password')
      .then(users => {
        res.json(users);
      })
      .catch(err => res.send({error: "A problem occurred, unable to retrieve users"}));
  });

//REGISTER user
server.post('/register', (req, res)=> {
    const credentials = req.body;

    const hash = bcrypt.hashSync(credentials.password, 14);
    credentials.password = hash;

  db('users')
    .insert(credentials)
    .then(ids=> {
      const id = ids[0];
      if (!credentials.username || !credentials.password) {
          res.status(400).json({message: "Please create a username and a password"});
      }
      res.status(201).json({newUserId: id});
    })
    .catch(err=> {
      res.status(500).json({error: "A problem occurred, unable to register this user"});
    })
});

//LOGIN user
server.post('/login', (req, res)=> {
    const loginCreds = req.body;
    db('users')
      .where({username: loginCreds.username})
      .first()
      .then(user=> {
        if (user && bcrypt.compareSync(loginCreds.password, user.password)) {
          res.status(200).json(`Welcome, ${user.username}!`);
        } else {
          res.status(401).json({message: "The username and/or password is incorrect"});
        }
      })
      .catch(err=> {
        res.status(500).json({error: "A problem occurred, unable to login"});
      });
});

server.listen(port, ()=> console.log(`API running on port ${port}`));