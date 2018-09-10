const express = require('express');
const db = require('knex')(require('./knexfile').development);
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();

const SALT_ROUNDS = process.env.SALT_ROUNDS || 12;
const SECRET = process.env.SECRET || 'a nasty tale told by 64 year old hermit';

function isLoggedIn(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  res.status(403).json({ message: 'you need to be logged in to do that' });
}

app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: SECRET,
    cookie: {
      maxAge: 12 * 60 * 60 * 1000,
    },
    resave: false,
    saveUninitialized: false,
    httpOnly: true,
  }),
);
app.use('/api/restricted', isLoggedIn);

app.post('/api/register', function(req, res, next) {
  let { username, password } = req.body;

  if (!username || !password)
    return res
      .status(400)
      .json({ message: 'Please provide a username and a password' });

  password = bcrypt.hashSync(password, SALT_ROUNDS);

  db('users')
    .insert({ username, password })
    .then(([id]) => {
      req.session.user = username;
      res.status(201).json({ message: 'Account created successfully', id });
    })
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

      req.session.user = username;

      res.status(200).json({ message: 'Login successful' });
    })
    .catch(next);
});

app.get('/api/users', isLoggedIn, function(req, res, next) {
  db('users').then(users => {
    res.json({
      message: `Hello ${req.session.user}`,
      users: users.map(user => ({ id: user.id, username: user.username })),
    });
  });
});

app.get('/api/restricted/topsecret', function(req, res) {
  res.status(200).json({ message: 'keep it a secret ' });
});

app.get('/api/logout', function(req, res, next) {
  if (req.session) {
    return req.session.destroy(err => {
      if (err) return next(err);

      res.status(200).json({ message: 'logout successful' });
    });
  }
  return res.status(500).json({ message: "Couldn't log out" });
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
