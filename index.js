const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('./db/dbconfig');
const session = require('express-session');

const port = process.env.PORT || 9000;
const server = express();

server.use(express.json());

const sessionConfig = {
  name: "Carlo's session",
  secret: 'Private key!!',
  cookie: {
    maxAge: 1 * 24 * 60 * 80 * 1000, // a day!!
    secure: false // on development set to false but on production set to true. Browser extensions might run js code on cookies
  },
  httpOnly: true, // not letting js code access cookies
  resave: false, //resave if the cookie is unaltered
  saveUninitialized: false // reduce server storage usage or complying with laws regarding cookies
};

server.use(session(sessionConfig));

server.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to auth I' });
});

server.get('/api/users', async (req, res) => {
  if (req.session && req.session.role === 'admin') {
    try {
      const response = await db('Users');
      res.status(200).json(response);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json({ message: 'Forbidden' });
  }
});

server.post('/api/register', (req, res) => {
  const creds = req.body;
  const hash = bcrypt.hashSync(creds.password, 3);
  creds.password = hash;
  db('Users')
    .insert(creds)
    .then(id => {
      res.status(201).json({ message: `Created user with a id of ${id}` });
    })
    .catch(err => {
      res.status(500).json({ message: 'Bad Request' });
    });
});

server.post('/api/login', (req, res) => {
  const creds = req.body;
  req.session.name = creds.username;
  db('Users')
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        req.session.role = user.role;
        res.status(200).json({ message: 'Welcome' });
      }
    })
    .catch(err => {
      res.status(401).json({ message: 'Unauthorized' });
    });
});

server.get('/api/greet', (req, res) => {
  if (req.session && req.session.name) {
    res.status(400).json({ message: ` Welcome ${req.session.name}` });
  } else {
    res.status(404).json({ message: 'Please login' });
  }
});
server.listen(port, () => {
  console.log(`\n === Server listening on ${port}k === \n`);
});
