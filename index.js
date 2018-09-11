const express = require("express");
const helmet = require("helmet");
const knex = require("knex");
const bcrypt = require("bcryptjs");
const session = require("express-session");

const dbConfig = require("./knexfile");

const db = knex(dbConfig.development);

const server = express();
const sessionConfig = {
  name: "fatdog", // default is connect.sid
  secret: "fat cats are the worst!",
  cookie: {
    maxAge: 1 * 24 * 60 * 60 * 1000, // a day
    secure: false // only set cookies over https. Server will not send back a cookie over http.
  }, // 1 day in milliseconds
  httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
  resave: false,
  saveUninitialized: false
};

server.use(session(sessionConfig));
server.use(express.json());
server.use(helmet());


server.post("/api/register", (req, res) => {
  const creds = req.body;
  const hash = bcrypt.hashSync(creds.password, 10); //should be no lower than 12 generally speaking
  creds.password = hash;

  db("users")
    .insert(creds)
    .then(ids => {
      const id = ids[0];
      res.status(201).json(id);
    })
    .catch(err => res.status(500).send(err));
});

server.post("/api/login", (req, res) => {
  const creds = req.body;

  db("users")
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        req.session.username = user.username;
        res.status(200).send(`Welcome ${req.session.username}!`);
      } else {
        res.status(401).json({ message: "No passing you thief!" });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Error posting" });
    });
});

server.get("/api/admins", (req, res) => {
  db("users")
    .then(users => {
      req.status(200).send(users);
    })
    .catch(err => res.send(err));
});

server.get("/api/users", (req, res) => {
  if (req.session && req.session.username) {
    db("users")
      .then(users => {
        res.status(200).json(users);
      })
      .catch(err => 
        res.status(500).json({message: 'Error retrieving users.'}));
  } else {
    res.status(401).json({ message: "Nope. No passing for you!" });
  }
});

server.get("/api/greet", (req, res) => {
  const name = req.session.username;
  res.send(`Hey there, ${name}`);
});

const port = 8800;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
