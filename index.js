const express = require('express');
const db = require('knex')(require('./knexfile').development);
const bcrypt = require('bcryptjs');

const app = express();

const SALT_ROUNDS = process.env.SALT_ROUNDS || 12;

app.use(express.json());

app.post('/api/register', function(req, res, next) {
  let { username, password } = req.body;

  if (!username || !password)
    return res
      .json(400)
      .json({ message: 'Please provide a username and a password' });

  password = bcrypt.hashSync(password, SALT_ROUNDS);

  db('users')
    .insert({ username, password })
    .then(([id]) =>
      res.status(201).json({ message: 'Account created successfully', id }),
    )
    .catch(next);
});

app.use(function(err, _, res, _) {
  console.log(err);
  res.status(500).json({ message: 'Something went wrong' });
});

app.listen(5000, function() {
  console.log('\n=== Server running on port 5000 ===\n');
});
