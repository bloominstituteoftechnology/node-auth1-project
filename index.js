const express = require("express");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const knex = require("knex");
const knexConfig = require("./knexfile.js");
const session = require('express-session');

const server = express();
const db = knex(knexConfig.development);

server.use(express.json());
server.use(cors());

// configure express-session middleware
server.use(
  session({
    name: 'notsession', // default is connect.sid
    secret: 'nobody tosses a dwarf!',
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000,
      secure: true, // only set cookies over https. Server will not send back a cookie over http.
    }, // 1 day in milliseconds
    httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
    resave: false,
    saveUninitialized: false,
  })
);


// GET
server.get('/', (req, res) => {
  res.send('server functional');
})

server.get('/users', (req, res) => {
  db('users').select('id', 'username', 'password').then(users => {
      res.json(users);
  })
  .catch(err => {
      console.log(err);
      res.json({error: err});
  })
})
////

// POST //
server.post('/api/register', (req, res) => {
  const credentials = req.body;
  const hash = bcrypt.hashSync(credentials.password, 14);
  credentials.password = hash;

  db('users').insert(credentials).then(ids => {
      // return the respective user's id
      const id = ids[0];
      res.status(201).json({newUserId: id})
  })
  .catch(err => {
      res.status(500).json({errorMessage: `There was an error registering.\n`, error: err})
  })
})

server.post("/api/login", (req, res) => {
  const creds = req.body;
  db("users")
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        res.status(200).json({ message: "You may enter" });
      } else res.status(401).json({ message: "YOUUUU SHALLLL NOTTTTT PASSSSS" });
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(err);
    });
});
/////
 
// Server Listener
server.listen(9000, () => {
  console.log("API is running");
});