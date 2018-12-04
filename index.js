const express = require("express");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const knexSessionStore = require('connect-session-knex')(session);

const knex = require("knex");
const knexConfig = require("./knexfile");
const db = knex(knexConfig.development);

const server = express();

const sessionConfig = {
  secret: "jifeowmdeidgfmw432l;421rqewfjiof0-o23rkoq",
  cookie: {
    maxAge: 1000 * 60 * 10,
    secure: false
  },
  httpOnly: true,
  resave: false,
  saveUninitialized: false,
  store : new knexSessionStore({
      tablename: 'sessions',
      sidfieldname: 'sid',
      knex: db,
      createtable: true,
      clearInterval: 1000 * 60 * 60
  })
};

server.use(session(sessionConfig));
server.use(express.json());

server.get("/", (req, res) => {
  res.send("Its alive!");
});

server.get("/users", (req, res) => {
  if (req.session && req.session.userId) {
    db("authorize")
    .then(creds => {
      res.json(creds);
    });
  } else {
    res.status(401).json({ message: `you aren't logged in!` });
  }
});

server.post("/api/register", (req, res) => {
  const credentials = req.body;

  const hash = bcrypt.hashSync(credentials.password, 14);
  credentials.password = hash;

  db("authorize")
    .insert(credentials)
    .then(ids => {
      const id = ids[0];
      res.status(201).json({ newUserId: id });
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

server.post("/api/login", (req, res) => {
  const creds = req.body;

  db("authorize")
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        req.session.userId = user.id;
        res.status(200).json({ welcome: creds.username });
      } else {
        res.status(401).json({ message: "you shall not pass!" });
      }
    })
    .catch(err => res.status(500).json({ err }));
});

server.get('/api/logout', (req, res) => {
    if(req.session) {
        req.session.destroy(err => {
            if (err) {
                res.send('error loggin out');
            } else {
                res.send('see you next time!');
            }
        })
    }
})

server.listen(8000, () => console.log("\n== Port 8k ==\n"));
