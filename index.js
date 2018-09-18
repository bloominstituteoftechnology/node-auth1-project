const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const db = require("./database/dbConfig.js");
const KnexSessionStore = require("connect-session-knex")(session);

//--------------------------------------//
// Optional Way for configuration //
//const knexConfig = require("./knexfile");
//const db = knex(knexConfig.development);
//-------------------------------------//

const server = express();

// session configuration
const sessionsConfig = {
  name: "monkey", // default is connect.sid
  secret: "nobody tosses a dwarf!",
  cookie: {
    maxAge: 1 * 24 * 60 * 60 * 1000, // a day
    secure: false // only set cookies over https. Server will not send back a cookie over http.
  }, // 1 day in milliseconds
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
};
// session configuration

server.use(session(sessionsConfig));
server.use(express.json());
server.use(cors());

// middleware
function auth(req, res, next) {
  if (req.session && req.session.username) {
    next();
  } else {
    res.status(401).json({ Error: "You shall not pass!!" });
  }
}

//============GET ENDPOINT============//
server.get("/api/users", auth, (req, res) => {
  db("users")
    .select("id", "username")
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      console.log("Error: ", err);
      res.status(500).json({ Error: "Could not get users" });
    });
});
//============GET ENDPOINT============//

//============POST REGISTER ENDPOINT============//
server.post("/api/register", (req, res) => {
  const creds = req.body;
  const hash = bcrypt.hashSync(creds.password, 3);
  creds.password = hash;

  db("users")
    .insert(creds)
    .then(ids => {
      const id = ids[0];
      res.status(200).json(id);
    })
    .catch(err => {
      console.log("Error: ", err);
      res.status(500).json({ Error: "Couldn't post register" });
    });
});
//============POST REGISTER ENDPOINT============//

//============POST LOGIN ENDPOINT============//
server.post("/api/login", (req, res) => {
  const creds = req.body;

  db("users")
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        // grab roles from user
        // req.session.roles = roles
        req.session.username = user.username;

        res.status(200).send("Welcome To FSW12 Lamda School");
      } else {
        res.status(401).json({ Error: "Cannot Authorize" });
      }
    })
    .catch(err => {
      console.log("Error: ", err);
      res.status(500).json({ Error: "Login Failed" });
    });
});
//============POST LOGIN ENDPOINT============//

server.listen(2500, () => console.log("\n===Running on Port: 2500===\n"));
