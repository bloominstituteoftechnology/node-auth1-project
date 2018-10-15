const express = require("express");
const cors = require("cors");
const db = require("./data/db.js");
const session = require('express-session');

const bcrypt = require("bcryptjs");
const server = express();

server.use(cors());

server.use(express.json());

server.use(
    session({
        name: 'notsession',
        secret: 'I dont think you can say dwarf anymore',
        cookie: {
            maxAge: 1*24*60*60*1000,
            secure: true,
        },
        httpOnly: true,
        resave: false,
        saveUninitialized: false,
    })
)
///////////////////////////////////////////////////////
//////////////////////MIDDLEWARE///////////////////////
function protected(req, res, next) {
  if ( req.session.username) {
    next();
  } else {
    res.status(401).json({ message: 'you shall not pass!!' });
  }
}

/////////////////////ENDPOINTS//////////////////////////
server.get("/", (req, res) => {
  res.send("its alive");
});

server.post("/api/register", (req, res) => {
  let credentials = req.body;
  const hash = bcrypt.hashSync(credentials.password, 14);
  credentials.password = hash;

  db("users")
    .insert(credentials)
    .then(id => {
      res.status(201).json({ newUserId: id });
    })
    .catch(err => {
      res.status(500).send(err.message);
    });
});

server.post("/api/users", (req, res) => {
  const credentials = req.body;

  db("users")
    .where({ username: credentials.username })
    .first()
    .then(user => {
      if (!user || !bcrypt.compareSync(credentials.password, user.password)) {
        return res.status(401).json({ error: "something isnt right" });
      } else { 
          req.session.username = user.username;
        res.status(200).send(`Welcome back ${credentials.username}`);
      }
    })
    .catch(err => {
      res.status(500).send("We are new to this and its showing");
    });
});

server.get("/api/users", protected, (req, res) => {
 
  db("users")
    .select("username", "password", "id")
    .then(users => {
      res.status(200).json({ users });
    })
    .catch(err => {
      res.status(500).json({ err });
    });
  });

server.listen(9000, () => console.log("blah blah blah 9000"));
