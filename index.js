// external imports
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");

//init db and server
const db = require("./database/dbConfig");
const server = express();

//necessary middleware
server.use(express.json());
server.use(cors());

//endpoints

server.get("/", (req, res) => {
  console.log("hey I'm here");
  res.send("working");
});

// create new user (register)
server.post("/api/register", (req, res) => {
  // grab username and password from body
  const creds = req.body;

  //verify username and password was submitted
  if (!creds.username || !creds.password) {
    res.status(400).json({ message: "Submit both username and password" });
  } else {
    //verify username does not already exist (needs to be unique)
    db("users")
      .where({ username: creds.username })
      .first()
      .then(user => {
        //kill request if user already exists
        if (user) {
          res.status(422).json({ message: "That username is already taken." });
        } else {
          //generate hash
          const hash = bcrypt.hashSync(creds.password, 2);

          //override password with hash
          creds.password = hash;

          //save user to db, return new user's id
          db("users")
            .insert(creds)

            .then(id => {
              res.status(201).json(id);
            })
            .catch(err =>
              res
                .status(500)
                .json({ error: "Error while saving this user: ", user })
            );
        }
      });
  }
});

// authenticate user
server.post("/api/login", (req, res) => {
  const creds = req.body;

  db("users")
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        res.status(200).json({ message: "Login successful" });
      } else {
        res.status(401).json({ message: "No login for you!" });
      }
    })
    .catch(err =>
      res.status(500).json({ error: "Error during login attempt: ", err })
    );
});

//TODO: get list of all users IF user is logged in
server.get("/api/users", (req, res) => {
  db("users")
    .select("id", "username")
    .orderBy("id")
    .then(users => res.status(200).json(users))
    .catch(err =>
      res
        .status(500)
        .json({ error: "Error occurred while retrieving users: ", err })
    );
});

server.listen(5500, () => console.log("\nrunning on Port 5500\n"));
