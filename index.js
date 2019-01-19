const express = require('express');
const bcrypt = require('bcryptjs');

const dbHelper = require('./data/helpers/dbHelpers.js');

const server = express();
const port = 8000;

server.use(express.json());

server.post('/api/register', (req, res) => {
  const user = req.body;
  user.password = bcrypt.hashSync(user.password);
  dbHelper.insert(user)
    .then(ids => res.status(201).json({ id: ids[0] }))
    .catch(err => res.status(500).json(err));
});

server.post('/api/login', (req, res) => {
  const user = req.body;
  dbHelper.findByUsername(user)
    .then((users) => {
      if (users.length && bcrypt.compareSync(user.password, users[0].password)) {
        res.json({ message: 'Login successful' });
      } else {
        res.status(404).json({ error: 'You shall not pass!' });
      }
    })
    .catch(err => res.status(500).json(err));
});

server.listen(port, console.log(`\nWeb API running on http://localhost:${port}\n`));
