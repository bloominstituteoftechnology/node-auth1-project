const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');

const db = require('./data/db.js');
const Account = require('./data/Account.js');
const server = express();

mongoose
  .connect(db)
  .then(() => console.log('\n... API Connected to Database ...\n'))
  .catch(err => console.log('\n*** ERROR Connecting to Database ***\n', err));

server.use(helmet());
server.use(express.json());

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
      let hashPassword = response[0].password
      Account.comparePassword(account.password, hashPassword, function(err, response) {
        if (err) return res.status(500).json({ message: err })
        if (response) return res.status(200).json({ message: 'You are logged in!' })
        return res.status(401).json({ message: 'You shall not pass.' })
      })
    })
    .catch(err => res.status(500).json({ message: err }))
});

const port = process.env.PORT || 5000;
server.listen(port, () =>
  console.log(`\n\nAPI running on http://localhost:${port}`)
);
