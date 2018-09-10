const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const db = require("./data/dbConfig.js");

const server = express();

server.use(express.json());
server.use(cors());

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

// protect this route, only authenticated users should see it
server.get("/api/users", (req, res) => {
  db("users")
    .select("id", "username")
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

server.listen(4000, () => console.log("\nrunning on port 4000\n"));
