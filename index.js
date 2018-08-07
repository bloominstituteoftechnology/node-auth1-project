const express = require("express");
const db = require("./data/db");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const server = express();

function protected(req, res, next) {
  if (req.session && req.session.username === "billybob") {
    //if(req.session && req.session.username)
    next();
  } else {
    return res
      .status(401)
      .json({ error: "Incorrect credentials, You Shall not Pass!" });
  }
}

function roles(req, res, next) {
  return function(roles) {
    if (req.session && req.session.username === "billybob") {
      next();
    } else {
      return res.status(401).json({ error: "Incorrect credentials" });
    }
  };
}

server.use(
  session({
    name: "notsession",
    secret: "nobody tosses a dwarf!",
    cookie: { maxAge: 1 * 24 * 60 * 60 * 1000 },
    httpOnly: true,
    secure: false,
    resave: false,
    saveUninitialized: true
  })
);
server.use(express.json());

server.get("/", (req, res) => {
  req.session.name = "Frodo";
  res.send("got it");
});
server.get("/greet", (req, res) => {
  const name = req.session.name;
  res.send(`Hello ${req.session.name}`);
});

server.get("/api", (req, res) => {
  res.send("working...");
});

server.post("/api/register", (req, res) => {
  const user = req.body;
  const hash = bcrypt.hashSync(user.password, 14);
  user.password = hash;
  console.log(user);
  db("users")
    .insert(user)
    .then(ids => {
      db("users")
        .where({ id: ids[0] })
        .first()
        .then(user => {
          req.session.username = user.username; //added
          res.status(201).json(user);
        });
    })
    .catch(err => {
      res.status(401).json({ err });
    });
});

server.post("/api/login", (req, res) => {
  const credentials = req.body;
  db("users")
    .where({ username: credentials.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(credentials.password, user.password)) {
        req.session.username = user.username;
        res.send(`Hello, ${user.username}`);
      } else {
        return res
          .status(401)
          .json({ error: "Incorrect credentials, You Shall not pass!" });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

server.get("/api/users", protected, (req, res) => {
  db("users")
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

server.get("/api/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.send("error logging out");
      } else {
        res.send("logged out");
      }
    });
  }
});

const port = 9000;
server.listen(port, function() {
  console.log(`Web API listening on http://localhost:${port}`);
});
