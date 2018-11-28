const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const bcrypt = require("bcryptjs");
const knex = require("knex");
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);
const knexConfig = require("./knexfile.js");

const db = knex(knexConfig.development);
const server = express();

//middleware
server.use(express.json());
server.use(cors());
server.use(helmet());
server.use(morgan("combined"));

server.use(
  session({
    name: "notsession",
    secret: "this is the secretest secret",
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000,
      secure: false
    },
    httpOnly: true,
    resave: false,
    saveUninitialized: false,
    store: new KnexSessionStore({
      tablename: "sessions",
      sidfieldname: "sid",
      knex: db,
      createtable: true,
      clearInterval: 1 * 24 * 60 * 60 * 1000
    })
  })
);
server.use(admin);

function admin(req, res, next) {
  if (req.url.match("/admin")) {
    sessCheck(req, res, next);
  } else {
    next();
  }
}

function sessCheck(req, res, next) {
  if (req.session && req.session.name) {
    next();
  } else {
    res
      .status(401)
      .json({ message: "unauthorized access: please sign back in" });
  }
}

server.post("/login", (req, res) => {
  const { username, password } = req.body;
  db("users")
    .where({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.name = username;
        res.status(200).json({ message: "Welcome" });
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    })
    .catch(err => res.status(500).json(err));
});

server.post("/register", (req, res) => {
  const { username, password } = req.body;
  const hash = bcrypt.hashSync(password, 12);
  db("users")
    .insert({ username, password: hash })
    .then(ids => {
      res.status(201).json(ids);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

server.listen(9000, () => console.log("\nrunning on port 9000\n"));
