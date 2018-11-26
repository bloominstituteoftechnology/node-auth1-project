const express = require("express");
const bcrypt = require("bcryptjs");

const db = require("./database/dbConfig.js");

const server = express();

server.use(express.json());

port = 3000;

server.listen(port, () => console.log(`\n listening on port: ${port} \n`));

// Get users

server.get("/api/users", (req, res) => {
  db("users")
    .select("id", "username", "password")
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => res.send(err));
});

// Post to users

server.post("/api/register", (req, res) => {
  // grab username and password from body
  const creds = req.body;

  // generate the hash  from user's passwords
  const hash = bcrypt.hashSync(creds.password, 14);

  // override the user.password with the hash
  creds.password = hash;

  // save the user to the database
  db("users")
    .insert(creds)
    .then(ids => {
      res.status(201).json(ids);
    })
    .catch(err => json(err));
});

// Login

server.post("/api/login", (req, res) => {
  // grab username and password from body
  const creds = req.body;

  db("users")
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        //passwords match and user exists
        res.status(200).json({ message: "Welcome!" });
      } else {
        //   either username or password is invalid
        res.status(401).json({ message: "Username/Password does not exists" });
      }
    })
    .catch(err =>
      res.status(500).json({ message: "There was an error, please try again" })
    );
});
