const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');


const dbHelpers = require('./data/dbHelpers.js');

const server = express();
const PORT = 5111;

server.use(express.json());
server.use(session({
  name: 'notsession',
  secret: 'nobody tosses a dwarf!',
  cookie: {
    maxAge: 1 * 24 * 60 * 60 * 1000
  },
  httpOnly: true,
  resave: false,
  saveUninitialized: false
}))

server.post('/api/register', (req,res) => {
    const user = req.body;
    user.password = bcrypt.hashSync(user.password, 15);
    dbHelpers.registerUser(user)
    .then(id => {
      res.status(201).json({id: id[0]});
    })
    .catch(err => {
      res.status(500).json({ error: 'Registration Error' });
    })
  });
  
  server.post('/api/login', (req, res) => {
    const user = req.body;
    dbHelpers.loginUser(user)
    .then(users => {
      if (users.length && bcrypt.compareSync(user.password, users[0].password)) {
        req.session.userId = users[0].id;
        res.status(200).json({ message: 'Success!' });
      } else {
        res.status(400).json({ error: 'Invalid username or password' });
      }
    })
    .catch(err => {
      res.status(500).json({ error: 'Login Error' });
    })
  });

  server.get('/api/users', (req, res) => {
    if (req.session && req.session.userId) {
      dbHelpers.findUsers()
      .then(users => {
        res.json(users);
      })
      .catch(err => res.send(err));
    } else {
      res.status(400).send('access denied')
    }
  });

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
