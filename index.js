const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const session = require("express-session");
// require the store library
const KnexSessionStore = require("connect-session-knex")(session);

const db = require("./data/dbConfig.js");

const server = express();

// configure express-session middleware
server.use(
  session({
    name: "zipedeedodah", // default is connect.sid
    secret: "my what a wonderful feelin'",
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day in milliseconds
      secure: false // only set cookies over https. Server will not send back a cookie over http.
    },
    httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
    resave: false,
    saveUninitialized: false,
    store: new KnexSessionStore({
      tablename: "sessions",
      sidfieldname: "sid",
      knex: db,
      createtable: true,
      clearInterval: 1000 * 60 * 60
    })
  })
);

server.use(express.json());
server.use(cors());

function protected(req, res, next) {
  if (req.session && req.session.username) {
    next();
  } else {
    res.status(401).json({ message: "You shall not pass!!" });
  }
}

server.use('/api/restricted', protected)

server.get("/", (req, res) => {
  res.send("This is working...");
});

server.post("/api/register", (req, res) => {
  //grab credentials
  const creds = req.body;

  // hash the password
  const hash = bcrypt.hashSync(creds.password, 10);

  //replace the user password with the hash
  creds.password = hash;

  //save the user
  db("users")
    .insert(creds)
    .then(ids => {
      const id = ids[0];

      //return 201 status
      res.status(201).json(id);
    })
    .catch(err => res.status(500).send(err));
});

server.post("/api/login", (req, res) => {
  // grab creds
  const creds = req.body;

  // find the user
  db("users")
    .where({ username: creds.username })
    .first()
    .then(user => {
      //check creds
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        req.session.username = user.username;
        res
          .status(200)
          .send(`Welcome to your account, ${req.session.username}`);
      } else {
        res.status(401).json({ message: "You shall not pass!" });
      }
    })
    .catch(err => res.status(500).send(err));
});

server.get("/api/restricted/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.send("Error logging out");
      } else {
        res.send("Goodbye...");
      }
    });
  }
});

// protect this route, only authenticated users should see it
server.get("/api/users", protected, (req, res) => {
  db("users")
    .select("id", "username")
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

server.listen(4000, () => console.log("\nrunning on port 4000\n"));
