const express = require("express");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);

const db = require("./database/dbConfig.js");

const server = express();

// Remeber that this is a secret
const sessionConfig = {
  name: "monkey",
  secret: "This is a unique secret",
  cookie: {
    maxAge: 1000 * 60 * 10,
    secure: false // only set it over https; ...in production you want this to be true
  },
  httpOnly: true, // no js can touch this
  resave: false,
  saveUninitialized: false,
  store: new KnexSessionStore({
    table: "sessions",
    sidfieldname: "sid",
    knex: db,
    createtable: true,
    clearInterval: 1000 * 60 * 60
  })
};

server.use(session(sessionConfig)); // Wires up session management
server.use(express.json());

// Provide a configuration object and implemet it as a middleware

// Login

server.post("/api/login", (req, res) => {
  // grab username and password from body
  const creds = req.body;

  db("users")
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        //passwords match and user exists
        req.session.userId = user.id;
        res.status(200).json({ message: "Welcome!" });
      } else {
        //   either username or password is invalid
        res.status(401).json({ message: "Username/Password does not exist" });
      }
    })
    .catch(err =>
      res.status(500).json({ message: "There was an error, please try again" })
    );
});

// Get users

// Protect this route and only allow authenticated users to see it
server.get("/api/users", (req, res) => {
  if (req.session && req.session.userId) {
    // for every client that has successfully logged in to the client we are going to add in a session
    // They are logged in
    db("users")
      .select("id", "username", "password")
      .then(users => {
        res.status(200).json(users);
      })
      .catch(err => res.send(err));
  } else {
    res.status(401).json({ message: "You shall not pass!" });
  }
});

// log out

server.get("/api/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.send("You can never leave!");
      } else {
        res.send("bye :( ");
      }
    });
  }
});
// Post to users

server.post("/api/register", (req, res) => {
  // grab username and password from body
  const creds = req.body;

  // generate the hash  from user's passwords
  const hash = bcrypt.hashSync(creds.password, 14);

  // override the user.password with the hash
  creds.password = hash;

  // save the user to the database
  db("users")
    .insert(creds)
    .then(ids => {
      res.status(201).json(ids);
    })
    .catch(err => json(err));
});

port = 3000;

server.listen(port, () => console.log(`\n listening on port: ${port} \n`));
