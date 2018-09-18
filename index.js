const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const session = require("express-session");
// require your store library
const KnexSessionStore = require("connect-session-knex")(session);

const db = require("./database/dbConfig.js");

const server = express();

server.use(express.json());
server.use(cors());

// configure express-session middleware
const sessionConfig = {
  name: "notsession", // default is connect.sid
  secret: "nobody tosses a dwarf!",
  cookie: {
    maxAge: 1 * 24 * 60 * 60 * 1000,
    secure: false // only set cookies over https. Server will not send back a cookie over http.
  }, // 1 day in milliseconds
  httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
  resave: false,
  saveUninitialized: false,
  store: new KnexSessionStore({
    tablename: "sessions",
    sidfieldname: "sid",
    knex: db,
    createtable: true,
    clearInterval: 1000 * 60 * 60
  })
};
// end sessionConfig middleware

server.use(session(sessionConfig));

// global middleware to restrict routes to logged in users only
function protect(req, res, next) {
  if (req.session && req.session.username) {
    next();
  } else {
    res.status(401).json({ message: "you shall not pass!!" });
  }
}
// end protection middleware

// testing cookies
server.get("/setname", (req, res) => {
  req.session.name = "Frodo";
  res.send("got it");
});

server.get("/greet", (req, res) => {
  const name = req.session.username;
  res.send(`hello ${name}`);
});
// end cookie test

server.get("/", (req, res) => {
  res.send("Server is humming along nicely.");
});

// protect this route, only authenticated users should see it
server.get("/api/users", protect, (req, res) => {
  db("users")
    .select("id", "username", "password")
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

// login
server.post("/api/login", (req, res) => {
  // grad creds
  const creds = req.body;
  // find the user
  db("users")
    .where({ username: creds.username })
    .first()
    .then(user => {
      // check creds
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        req.session.username = user.username;
        res.status(200).send(`Welcome ${req.session.username}`);
      } else {
        res.status(401).json({ message: "You shall not pass!" });
      }
    })
    .catch(err => res.status(500).send(err));
});
// end login

// register
server.post("/api/register", (req, res) => {
  // grab the credentials
  const creds = req.body;
  //hash the password
  const hash = bcrypt.hashSync(creds.password, 3);
  //replace the user passsword with the hash
  creds.password = hash;
  // save the user
  db("users")
    .insert(creds)
    .then(ids => {
      const id = ids[0];

      res.status(201).json(id);
    })
    .catch(err => res.status(500).send(err));
});
// end register

server.listen(3300, () => console.log("\nrunning on port 3300\n"));
