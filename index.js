const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const server = express();
const db = require('./data/helpers/dbHelpers')

const PORT = 3500;
server.use(
  express.json(),
  cors()
)

server.get('/api/users', (req, res) => {
  res.send('It works')
})
//registering a new user
server.post('/api/register', (req, res) => {
  const newUser = req.body;
  newUser.password = bcrypt.hashSync(newUser.password, 11);
  db.addUser(newUser)
    .then( userID => {
      res.status(201).json({id: userID[0]})
    })
    .catch( err => {
      res.status(500).json({errorMessage: "unable to create new user"})
    })
});

//authenticating a user when logging in
server.post('/api/login', (req, res) => {
  const userCreds = req.body;

  db.authorize(userCreds.username)
    .then(user => {
      if(user.length && bcrypt.compareSync(userCreds.password, user[0].password)) {
        db.getUsers()
          .then(users => {
            res.json(users)
          }).catch( err => {
            res.status(500).json({errorMessage: "unable to get users"})
          })
      } else {
        res.status(404).json({errorMessage: "You shall not pass"});
      }
    })
    .catch( err => {
      res.status(500).json({errorMessage: "unable to process authorization"})
    })
});

server.listen(PORT, () => {
  console.log(`<==== running server on port ${PORT} ===>`)
})