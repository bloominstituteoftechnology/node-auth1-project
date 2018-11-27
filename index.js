const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);

const db = require("./database/dbConfig.js");

const server = express();

const sessionConfig = {
  name: "john galt",
  secret: "iuojewroijennocioj",
  cookie: {
    maxAge: 1000 * 60 * 10,
    secure: false // in production this really oughta be true
  },
  httpOnly: true, // no JS touching this cookie
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

server.use(session(sessionConfig)); // wires up session management
server.use(express.json());
server.use(cors());

// T E S T
server.get("/", (req, res) => {
  res.send("We up");
});

// R E G I S T E R   R O U T E
server.post("/register", (req, res) => {
  const credentials = req.body;

  // hash the password
  const hash = bcrypt.hashSync(credentials.password, 14);
  credentials.password = hash;

  // save user
  db("users")
    .insert(credentials)
    .then(ids => {
      const id = ids[0];
      res
        .status(201)
        .json({ newUserId: id })
        .catch(err => {
          res.status(500).json(err);
        });
    });
});

// L O G I N   R O U T E
server.post("/login", (req, res) => {
  const credentials = req.body;

  db("users")
    .where({ username: credentials.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(credentials.password, user.password)) {
        req.session.user = user.id;
        res.status(200).json({ welcome: user.username });
      } else {
        res.status(401).json({ message: "big problem" });
      }
    })
    .catch(err => res.status(500).json({ err }));
});

// P R O T E C T E D   M I D D L E W A R E
function protected(req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({ you: "need to get off my lawn right now" });
  }
}

// U S E R   L I S T   R O U T E
server.get("/users", protected, (req, res) => {
  db("users")
    .select("id", "username", "password")
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

// L O G O U T   R O U T E
server.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.send("i'm really sorry about this");
      } else {
        res.send("ok man great to see you");
      }
    });
  } else {
    res.end();
  }
});

// S T R E T C H :  R E S T R I C T E D   R O U T E

server.get("/restricted/:anything", protected, (req, res) => {
  res.send("you can be here");
});

server.listen(3000, () => console.log("\nrunning on port 3000\n"));
