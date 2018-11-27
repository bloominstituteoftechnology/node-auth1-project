const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const db = require('./data/helpers');
const knexDb = require('./data/dbConfig');

const server = express();

const sessionConfig = {
  name: 'secretmysterycookie',
  secret: 'lasdn3039fff$#$RGfgd',
  cookie: {
    maxAge: 1000 * 60 * 10,
    secure: false
  },
  httpOnly: true,
  resave: false,
  saveUninitialized: false,
  store: new KnexSessionStore({
    tablename: 'sessions',
    sidfieldname: 'sid',
    knex: knexDb,
    createtable: true,
    clearInterval: 1000 * 60 * 60
  })
};

// Middleware
server.use(session(sessionConfig));
server.use(express.json());

// Custom Middleware
function protected(req, res, next) {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.status(401).json({ message: 'You are not logged in.' });
  }
}

// REGISTER
server.post('/api/register', async (req, res) => {
  // get form input values
  const registrationData = req.body;

  // validate data
  if (!registrationData.username || !registrationData.password) {
    return res
      .status(400)
      .json({ message: 'Please enter a valid username and password.' });
  }

  // Check if user already exists
  try {
    const userInDb = await db.getByUsername(registrationData.username);
    if (userInDb) {
      res.status(422).json({ message: 'That username already exists.' });
    }
  } catch (error) {
    err => res.status(500).json({ error: 'caught' });
  }

  // generate a hash
  const hash = bcrypt.hashSync(registrationData.password, 10);

  // replace plain text with hash
  registrationData.password = hash;

  // save to db
  try {
    const newUserId = await db.addUser(registrationData);
    res.status(201).json(newUserId);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong with the request.' });
  }
});

// LOGIN
server.post('/api/login', async (req, res) => {
  // get form input values
  const loginData = req.body;

  // get user
  try {
    const user = await db.getByUsername(loginData.username);
    if (user && bcrypt.compareSync(loginData.password, user.password)) {
      req.session.userId = user.id;
      res.status(200).json({ message: 'Logged in.' });
    } else {
      res
        .status(401)
        .json({ message: 'The username or password does not match.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong, pal.' });
  }
});

// GET USERS
server.get('/api/users', protected, async (req, res) => {
  try {
    const users = await db.get();
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Something went wrong getting the users.' });
  }
});

server.get('/', (req, res) => {
  res.send('Helllo there.');
});

server.listen(3300, () => console.log('Server started on port 3300'));
