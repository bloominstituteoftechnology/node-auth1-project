const express = require('express');
const helmet = require('helmet');
const knex = require("knex");
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const bcrypt = require("bcryptjs");
const knexConfig = require("./knexfile");
const cors = require("cors");

const db = knex(knexConfig.development)

const server = express();

const sessionConfig = {
    name: 'foobarbanana', 
    secret: 'thisisasecretkey',
    cookie: {
      maxAge: 1000 * 60 * 10,
      secure: false, // only set it over https; in production you want this true.
    },
    httpOnly: true, // no js can touch this cookie
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

server.use(session(sessionConfig));
server.use(express.json());
server.use(helmet());
server.use(cors());

const protected = (req, res, next) => req.session && req.session.user ? next() : res.status(401).json({ you: "shall not pass!"});

server.post("/api/register", (req, res) => {
    const creds = req.body;

    if (creds.username === "" || creds.username === undefined) {
        return res.status(400).json({error: "Please enter a username."})
    }

    if (creds.password === "" || creds.password === undefined) {
        return res.status(400).json({error: "Please enter a password."})
    }

    const hash = bcrypt.hashSync(creds.password, 8);
    creds.password = hash;
    db("users")
        .insert(creds)
        .then(ids => res.status(201).json(ids))
        .catch(err => res.status(401).json(err))
})

server.post("/api/login", (req, res) => {
    const creds = req.body;

    if (creds.username === "" || creds.username === undefined) {
        return res.status(400).json({error: "Please enter a username."});
    }

    if (creds.password === "" || creds.password === undefined) {
        return res.status(400).json({error: "Please enter a password."});
    }

    db("users")
        .where({username: creds.username})
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(creds.password, user.password)) {
                req.session.user = user.id;
                res.status(200).json({message: "Logged in!"});
            } else {
                res.status(401).json({message: "You shall not pass!"});
            }
        })
        .catch(err => res.status(401).json(err));
})

server.get("/", (req, res) => {
    res.status(200).json({api: "running"});
})

server.get("/api/users", protected, (req, res) => {
    db("users")
        .select("id", "username", "password")
        .then(users => res.status(200).json(users))
        .catch(err => res.status(401).json(err))
})

server.get('/api/logout', (req, res) => {
    if (req.session && req.session.user) {
      req.session.destroy(err => {
        if (err) {
          res.status(401).send('you can never leave');
        } else {
          res.status(200).send('bye');
        }
      });
    } else {
      res,status(401).send("you're already logged out, weirdo");
    }
  });

const port = 9001;

server.listen(port, function() {
    console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});