const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('./database/dbConfig.js');

const server = express();
server.use(express.json());

server.post('/api/register', (req, res) => {
    // grab username and password from body
    const creds = req.body;
    // generate the hash from the user's password
    const hash = bcrypt.hashSync(creds.password, 4); // rounds is 2^X
    // override the user.password with the hash
    creds.password = hash;
    // save the user to the database
    db('users')
    .where({ username: creds.username })
    .then(user => {
        if (user) {
        res.status(409).json({ message: 'username already exists' });
        } else {
        db('users')
        .insert(creds)
        .then(ids => {  
            res.status(201).json(ids);
        })
        }
    })
    .catch(err => res.json(err));
});

server.post('/api/login', (req, res) => {
    // grab username and password from body
    const creds = req.body;
  
    db('users')
      .where({ username: creds.username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(creds.password, user.password)) {
          // passwords match and user exists by that username
          res.status(200).json({ message: 'welcome!' });
        } else {
          // either username is invalid or password is wrong
          res.status(401).json({ message: 'you shall not pass!!' });
        }
      })
      .catch(err => res.json(err));
  });
  
  
  server.listen(3300, () => console.log('\nrunning on port 3300\n'));
  