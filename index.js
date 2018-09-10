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
      .status(400)
      .json({ message: 'Please provide a username and a password' });

  password = bcrypt.hashSync(password, SALT_ROUNDS);

  db('users')
    .insert({ username, password })
    .then(([id]) =>
      res.status(201).json({ message: 'Account created successfully', id }),
    )
    .catch(next);
});

app.post('/api/login', function(req, res, next) {
  const { username, password } = req.body;

  if (!username || !password)
    return res
      .status(400)
      .json({ message: 'Please provide a username and password ' });

  db('users')
    .where('username', username)
    .first()
    .then(user => {
      if (!user)
        return res
          .status(400)
          .json({ message: 'Username or password is invalid ' });

      if (!bcrypt.compareSync(password, user.password))
        return res
          .status(400)
          .json({ message: 'Username or password is invalid ' });

      res.status(200).json({ message: 'Login successful' });
    })
    .catch(next);
});

app.use(function(err, _, res, _) {
  console.log(err);
  if (err.errno === 19)
    return res.status(400).json({ message: 'username is already taken' });

  res.status(500).json({ message: 'Something went wrong' });
});

app.listen(5000, function() {
  console.log('\n=== Server running on port 5000 ===\n');
});
