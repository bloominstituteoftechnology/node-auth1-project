const express = require("express");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const knex = require("knex");
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);
const server = express();

//set up db
const knexConfig = require("./knexfile.js");
const db = knex(knexConfig.development);

//set up session config object
const sessionConfig = {
  store: new KnexSessionStore({
    tablename: "sessions",
    sidfieldname: "sid",
    createtable: true,
    clearInterval: 60000 // clear expired sessions
  }),
  secret: "this.isMy-Secret#Object",
  name: "alejandro",
  httpOnly: true,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 1
  }
};
// apply middleware
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

//Routes
//protected - route
server.get("/api/users", protected, (req, res) => {
  const creds = req.body;
  console.log("hiiiii");
  console.log(req.session);

  db("users")
    .then(users => res.json(users))
    .catch(err => res.status(500).json(err));
});

function protected(req, res, next) {
  if (req.session && req.session.userId) {
    console.log(req.session.userId);
    next();
  } else res.status(401).json({ error: "Not authorized" });
}
server.post("/api/register", (req, res) => {
  const creds = req.body;
  const hash = bcrypt.hashSync(creds.password, 14);
  creds.password = hash;
  db("users")
    .insert(creds)
    .then(idObj => {
      console.log(idObj);
      const id = idObj[0];
      req.session.userId = id;
      res.json({ newUserId: id });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

server.post("/api/login", (req, res) => {
  const creds = req.body;
  console.log(creds);
  db("users")
    .where({ username: creds.username })
    .first()
    .then(user => {
      console.log(user);
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        req.session.userId = user.id;
        res.status(200).json({ message: "Access granted" });
      } else res.status(401).json({ message: "You shall not pass" });
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(err);
    });
});

server.get("/api/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.send("nooooo");
      } else res.json({ message: "You have logged out" });
    });
  }
});

server.listen(9000, () => {
  console.log("API is running");
});
