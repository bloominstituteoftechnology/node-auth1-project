const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const session = require('express-session')

const db = require('./data/db.js');
const Account = require('./data/Account.js');
const server = express();

mongoose
  .connect(db)
  .then(() => console.log('\n... API Connected to Database ...\n'))
  .catch(err => console.log('\n*** ERROR Connecting to Database ***\n', err));

server.use(helmet());
server.use(express.json());
server.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false
}));

server.post('/api/register', (req, res) => {
  const account = req.body
  Account.create(account)
    .then(response => res.status(201).json({ id: response.id }))
    .catch(err => res.status(500).json({ message: err }))
});

server.post('/api/login', (req, res) => {
  const account = req.body
  Account.find({ username: account.username })
    .then(response => {
      //validate password
      response[0].comparePassword(account.password, function(bcryptResponse) {
        if (bcryptResponse) {
          // create session
          req.session._id = response[0]._id
          return res.status(200).json({ message: 'You are logged in.' })
        }
        return res.status(401).json({ message: 'You shall not pass.' })
      })
    })
    .catch(err => res.status(500).json({ message: err }))
});

server.post('/api/logout', (req, res) => {
  if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if (err) {
        return res.status(500).json({ message: err });
      }
      else {
        return res.status(200).json({ message: 'You are logged out!' });
      }
    });
  }
})

server.get('/api/users', (req, res) => {
  console.log(req.session)
  if (req.session._id) {
    return Account.find({})
      .then(response => res.status(200).json({ data: response }))
      .catch(err => res.status(500).json({ message: err }))
  }

  return res.status(401).json({ message: 'You need to log in first' })
})

const port = process.env.PORT || 5000;
server.listen(port, () =>
  console.log(`\n\nAPI running on http://localhost:${port}`)
);
