const express = require("express");
const bcrypt = require("bcryptjs");
const mwConfig = require("./data/mwConfig");
const db = require("./data/dbConfig.js");
const session = require("express-session");
const knexSessionStore = require("connect-session-knex")(session);

const sessionConfig = {
  name: "notsession",
  secret: "Keep it secret, keep it safe.",
  cookie: {
    maxAge: 1 * 15,
    secure: false
  },
  httpOnly: true,
  resave: false,
  saveUninitialized: false,
  store: new knexSessionStore({
    tablename: "sessions",
    sidfieldname: "sid",
    knex: db,
    createtable: true,
    clearInterval: 1000 * 60 * 60
  })
};
const PORT = 9090;
const server = express();
server.use(express.json());
server.use(session(sessionConfig));
mwConfig(server);

// endpoints

server.post("/register", (req, res) => {
  const credentials = req.body;
  const hash = bcrypt.hashSync(credentials.password, 14);
  credentials.password = hash;

  db("users")
    .insert(credentials)
    .then(ids => {
      res.status(201).json(ids);
    })
    .catch(() => {
      res.status(500).json({ error: "Unable to register user" });
    });
});

server.post("/login", (req, res) => {
  const credentials = req.body;

  db("users")
    .where({ username: credentials.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(credentials.password, user.password)) {
        req.session.userId = user.id;
        res.status(200).json({ message: `${user.username} is logged in` });
      } else {
        res.status(401).json({ message: "You shall not pass!" });
      }
    })
    .catch(() => {
      res.status(500).json({ message: "Please try logging in again." });
    });
});

function gatekeeper(req, res, next) {
  if (req.session.id) {
    next();
  } else {
    res
      .status(401)
      .json({ message: "You shall not pass, not an authorized user." });
  };
};

// protect this endpoint so only logged in users can see the data
server.get("/restricted/users", gatekeeper, (req, res) => {
  db("users")
    .select("id", "username")
    .then(users => {
      res.json(users);
    })
    .catch(() => {
      res.status(500).json({ message: "You shall not pass!" });
    });
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
