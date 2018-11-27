const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("./database/dbConfig");
const cors = require("cors");
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);

const server = express();

const sessionConfig = {
  name: "monkey",
  secret: "alk;sdjhgfpaisrhfa;sdfuighak;rjghspdiofuga;dfkljhg",
  cookie: {
    maxAge: 1000 * 60 * 10,
    secure: false //only set it over https; in production this needs to be true.
  },
  httpOnly: true,
  resave: false,
  saveUninitialized: false, // no js can touch this cookie
  store: new KnexSessionStore({
    tablename: "sessions",
    sidfieldname: "sid",
    knex: db,
    createtable: true,
    clearInterval: 1000 * 60 * 60
  })
};

server.use(session(sessionConfig));
server.use(express.json());
server.use(cors());

//custom middleware

function protected(req, res, next) {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.status(401).json({ message: "you shall not pass!!" });
  }
}

//endpoints

server.post("/api/register", (req, res) => {
  // grab username and password from body
  const creds = req.body;
  // generate the hash from the user's password
  const hash = bcrypt.hashSync(creds.password, 10); // rounds is 2^X
  // override the user.password with the hash
  creds.password = hash;
  // save the user to the database
  db("users")
    .insert(creds)
    .then(ids => {
      res.status(201).json(ids);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

server.post("/api/login", (req, res) => {
  // grab username and password from body
  const creds = req.body;
  db("users")
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        // passwords match and user exists by that username
        req.session.userId = user.id;
        res.status(200).json({ message: "welcome!" });
      } else {
        // either username is invalid or password is wrong
        res.status(401).json({ message: "you shall not pass!!" });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

server.get("/api/users", protected, (req, res) => {
  db("users")
    .select("id", "username", "password") // ***************************** added password to the select
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

server.get("/api/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.send("you can never leave");
      } else {
        res.send("bye");
      }
    });
  } else {
    res.end();
  }
});

server.listen(4500, () => console.log("\n== Port 4500 ==\n"));
