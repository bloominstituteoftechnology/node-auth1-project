const express = require("express");
const helmet = require("helmet");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const session = require("express-session");

const KnexSessionStore = require("connect-session-knex")(session);
const store = new KnexSessionStore /* options here */(); // defaults to a sqlite3 database

const db = require("./db/helpers");

const server = express();

const sessionConfig = {
  name: "CookieMonster", // default is connect.sid
  secret: "u'llNeverGuess",
  cookie: {
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day in milliseconds
    secure: false // only set cookies over https. Server will not send back a cookie over http.
  },
  store: store,
  httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
  resave: false,
  saveUninitialized: false
};

server.use(session(sessionConfig));

server.use(express.json());
server.use(helmet());
server.use(cors());


server.post("/api/register", (req, res) => {
  const creds = req.body;

  const hash = bcrypt.hashSync(creds.password, 14);
  creds.password = hash;

  db.hashUser(creds)
    .then(id => res.status(201).send("Successful"))
    .catch(err => res.status(500).send("error creating user"));
});

server.post("/api/login", (req, res) => {
  const creds = req.body;

  db.verifyUser(creds)

    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        req.session.name = user.username;
        res.status(201).send(`Welcome ${ req.session.name}`);
      } else {
        return res.status(401).json({ error: "Incorrect credentials" });
      }
    })
    .catch(err => res.status(500).send("There was an issue with the server"));
});

server.get("/api/users", (req, res) => {
  db.get()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => res.status(500).json({ message: "error has occured" }));
});

server.get("/", (req, res) => {
  req.session.name = "Frodo";
  res.send("got it");
});

server.get("/greet", (req, res) => {
  const name = req.session.name;
  res.send(`hello ${name}`);
});

const port = 9000;
server.listen(
  port,
  console.log(`\n ===> Server is running on port:${port} <=== \n`)
);
