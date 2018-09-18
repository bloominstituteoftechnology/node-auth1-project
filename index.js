const express = require("express");
const session = require('express-session');

const server = express();
server.use(express.json());
//configure express-session middleware
const sessionConfig = {
  name: "notsession",
  secret: "this is a secret",
  cookie: {
    maxAge: 1 * 24 * 60 * 60 * 1000,
    secure: false
  },
  httpOnly: true,
  resave: false,
  saveUninitialized: false
};
server.use(session(sessionConfig));

const knex = require("knex");
const knexConfig = require("./knexfile");

const db = knex(knexConfig.development);

const bcrypt = require("bcryptjs");

server.post("/api/register", (req, res) => {
  const credentials = req.body;

  const hash = bcrypt.hashSync(credentials.password, 14);

  credentials.password = hash;
  console.log(credentials)
  // move on to save the user.
    db('users')
        .insert(credentials)
        .then(ids => {
      const id = ids[0];
      // return 201
      res.status(201).json(id);
    })
    .catch(err => {
      res.status(500).send(err);
    })
});

server.post("/api/login", (req, res) => {
  const credentials = req.body;
  // find the user in the database by it's username then
  db('users')
  .where({ username: credentials.username })
  .first()
  .then(user => {
    // check credentials
    if (username && bcrypt.compareSync(credentials.password, user.password)){
      // create new session for user and cookie containing user id
       req.session.userId = user.id
       res.status(200).send(`${user.username} is logged in`)
    } else {
      res.status(401).json({ error: "You shall not pass!" })
    }
  })
  .catch(err => {
    res.status(500).send(err)
})
});
  

server.get("/api/users", (req, res) => {
    db('users')
      .then(users => {
        res.json(users)
      })
      .catch(err => {
        res.status(500).send(err)
    })
});

const port = process.env.PORT || 8000;
server.listen(port, () => console.log(`Listening on port ${port}`));
