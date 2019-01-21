const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs')
const db = require('./database/dbConfig.js');
const session = require('express-session')
const server = express();

server.use(express.json());
server.use(cors());
server.use(session({
  name: 'notsession', // default is connect.sid
  secret: 'nobody tosses a dwarf!',
  cookie: {
    maxAge: 1 * 24 * 60 * 60 * 1000
  }, // 1 day in milliseconds
  httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
  resave: false,
  saveUninitialized: false,
}))

/* server.get('/', (req, res) => {
  res.send('Its Alive!');
}); */

server.get('/api/users/', (req, res) => {
 const user = req.body;
 const userId = req.body;
  console.log("req:", req)
  db.find()
    .then(users => {
      console.log("userId:", userId)   
     console.log("req.session:", req.session)
      if (req.session && userId) {
        console.log("users2:", users)
        res.json(users);
    
      } else {
        res.status(404).json({ err: "unable to access users, must be logged in..." });
      }
    })
    .catch(err => res.send(err));
});

server.post('/api/register', (req, res) => {
  const user = req.body;
  user.password = bcrypt.hashSync(user.password, 10);
  db.insert(user)
    .then(ids => {
      res.status(201).json({ id: ids[0] })
    })
    .catch(err => {
      res.status(500).send(err);
    })
})

server.post('/api/login', (req, res) => {
  // check that username exists AND that passwords match
  const bodyUser = req.body;
  db.findByUsername(bodyUser.username)
    .then(users => {
      // username valid   hash from client == hash from db
      if (users.length && bcrypt.compareSync(bodyUser.password, users[0].password)) {
        req.session.userId = users[0].id;
        res.json({ info: "correct" });
      } else {
        res.status(404).json({ err: "invalid username or password" });
      }
    })
    .catch(err => {
      res.status(500).send(err);
    });
});


server.post('/api/logout', (req, res) => {
  if (req.session && req.session.userId) {
    res.status(500).send('Not logged in.');
  } else {
    req.session.destroy(err => {
    if (err) {
      res.status(500).send('failed to logout.');
    } else {
      res.send('logout successful.')
    }
 
  })}
});

server.listen(3300, () => console.log('\nrunning on port 3300\n'));
