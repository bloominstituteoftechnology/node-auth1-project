const express = require("express");
const session = require('express-session');
const bcrypt = require("bcryptjs");
const db = require("./dbconfig.js");
const cors = require('cors')
const server = express();
const KnexSessionStore = require('connect-session-knex')(session);
const sessionConfig = {
    name: 'logincookie', 
    secret: 'i like turtles 746374 !!!',
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000, 
      secure: false, 
    }, 
    httpOnly: true, 
    resave: false,
    saveUninitialized: false,
    store: new KnexSessionStore({
      tablename: 'sessions',
      sidfieldname: 'sid',
      knex: db,
      createtable: true,
      clearInterval: 1000 * 60 * 60,
    }),
  };
  
server.use(express.json());
server.use(session(sessionConfig));
server.use(cors({ credentials: true, origin: 'http://localhost:3001' }));

function protected(req, res, next) {
    if (req.session && req.session.username) {
      next();
    } else {
      res.status(401).json({ message: 'you must be logged in to view this page' });
    }
  }

server.get("/", (req, res) => {
  res.send("helo!");
});

server.post("/register", (req, res) => {
  const creds = req.body;
  const hash = bcrypt.hashSync(creds.password, 3);
  creds.password = hash;
  db("users")
    .insert(creds)
    .then(ids => {
      const id = ids[0];
      res.status(201).json(id);
    })
    .catch(err => res.status(500).send(err));
});

server.get("/users", protected, (req, res) => {
  db("users")
    .select("id", "username")
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

server.post("/login", (req, res) => {
    const creds = req.body;
  db("users")
    .where("username", creds.username)
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        req.session.username = user.username;
        res.status(200).send(`Welcome ${req.session.username}`);
      } else {
        res.status(401).json({ message: "login info incorrect" });
      }
    })
    .catch(err => resstatus(500).send(err));
});

server.get('/logout', (req, res) => {
    if (req.session) {
      req.session.destroy(err => {
        if (err) {
          res.send('error logging out');
        } else {
          res.send('logged out');
        }
      });
    }
  });

server.listen(3000, () => console.log("\nrunning on port 3000\n"));
