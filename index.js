const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session');

const db = require('./database/dbHelpers.js');

const server = express();

// custom middleware
function protect (req, res, next) {
  if (req.session && req.session.userID) {
    next();
  } else {
    res.status(400).send('access denied.');
  }
}

server.use(express.json());
server.use(cors());
server.use(session({
  name: 'notsession', // default is connect.sid
  secret: 'nobody tosses a dwarf!',
  cookie: {
    maxAge: 1 * 24 * 60 * 60 * 1000,
    // Diandre said to take secure: true out.
    // secure: true, // only set cookies over https. Server will not send back a cookie over http.
  }, // 1 day in milliseconds
  httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
  resave: false,
  saveUninitialized: false,
}))

server.get('/', (req, res) => {
  res.send('Up and running!');
});

// Register a user
server.post('/api/register', (req, res) => {
  const user = req.body;
  user.password = bcrypt.hashSync(user.password);

  db.insert(user)
  .then(id => {
    res.status(201).json({ id: id[0] });
  })
  .catch(err => {
    res.status(500).send(err);
  })
})

server.post('/api/login', (req, res) => {
  const bodyUser = req.body;

  db.findByUserName(bodyUser.username)
  .then(users => {

    // check if username is valed
    // check is password from client === password from db
    // if (users.length && bodyUser.password === users[0].password)
    if (users.length && bcrypt.compareSync(bodyUser.password, users[0].password)) {
      // create session
      req.session.userID = users[0].id;
      res.json({ info: "Logged in" });
    } else {
      res.status(404).json({ err: "You shall not pass!"});
    }
  })
  .catch(err => {
    res.status(500).send(err);
  });
});

// protect this route, only authenticated users should see it
server.get('/api/users', protect, (req, res) => {
  console.log('session', req.session);
  // if (req.session && req.session.userId) {
      db.findUsers()
      .then(users => {
        res.json(users);
      })
      .catch(err => {
        res.status(500).send(err);
      })
  // } else {
  //   res.status(400).send('access denied.');
  // }
});

server.listen(3300, () => 
  console.log('\nrunning on port 3300\n'));