const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const helmet = require("helmet");
const knex = require("knex");
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);
const server = express();

const knexConfig = require("../knexfile");

const db = knex(knexConfig.development);

server.use(helmet());
server.use(express.json());
server.use(cors());

const sessionConfig = {
  name: "wolfpack", /// default is usually sid
  secret: "jfkalejfaljfeiafjdlafjilajfelajfeliejhflfhleihie*893897937972879",
  cookie: {
    maxAge: 1000 * 60 * 10,
    secure: false // only send cookie over https, should be true in production
  },
  httpOnly: true, // js cannot touch this
  resave: false,
  saveUninitialized: false,
  // other libraries might have a different setup than this
  store: new KnexSessionStore({
    tablename: "sessions",
    sidfieldname: "sid", // short for session id
    knex: db,
    createtable: true,
    clearInterval: 1000 * 60 * 60 // one hour!
  })
};

//============  this is so dumb, but this is not hoisted=============??
server.use(session(sessionConfig));
/////// ====== /////////

server.get("/", (req, res) => {
  res.send("We are up for now!");
});

server.post("/register", (req, res) => {
  //grab password and username from the body
  const userInfo = req.body;

  // generate the hash from the user's password - we also add a salt that involves time, and concatenates it to the pass
  const hash = bcrypt.hashSync(userInfo.password, 8); // rounds is 2^x

  // override the user.password with the hash
  userInfo.password = hash;

  //save the user to the database
  db("users")
    .insert(userInfo)
    .then(ids => {
      res.status(201).json(ids);
    })
    .catch(err => res.status(500).json(err));
});
// login system
server.post("/login", (req, res) => {
  //grab password and username from the body
  const creds = req.body;

  db("users")
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        // passwords match and user exists by that username
        req.session.user = user;
        res.status(200).json({ message: "welcome welcome buddy!" });
      } else {
        // either username or password is wrong
        res.status(401).json({ message: "you are not allowed in!" });
      }
    })
    .catch(err => res.json(err));
});

// middleware to protect our users route!
function protected(req, res, next) {
  // if the user is logged in next()
  if (req.session.user) {
    next();
  } else {
    //bounce them back
    res.status(401).json({
      message:
        "lol denied foooool. login in first and auth yourself befo u wrek urself"
    });
  }
}

// protect this route, only authenticated users should see it
server.get("/users", protected, (req, res) => {
  db("users")
    .select("id", "username", "password")
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

//logout system

server.get("/logout", protected, async (req, res) => {
  const users = await db("users");

  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.status(500).send("LOL U THOUGHT U COULD RUN");
      } else {
        res.status(200).send("good bye, come again");
      }
    });
  } else {
    res.json({ message: "yo, ur already logged out u crazy person" });
  }
});

module.exports = server;
