const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const db = require("./database/dbConfig.js");

const server = express();

server.use(express.json());
server.use(cors());

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
        res.status(200).json({ welcome: user.username });
      } else {
        res.status(401).json({ message: "big problem" });
      }
    })
    .catch(err => res.status(500).json({ err }));
});

// U S E R   L I S T   R O U T E
server.get("/users", (req, res) => {
  db("users")
    .select("id", "username", "password")
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

server.listen(3000, () => console.log("\nrunning on port 3000\n"));
