const express = require("express");
// const cors = require("cors");
const bcrypt = require("bcryptjs");

const db = require("./database/dbConfig.js");

//const knexConfig = require("./knexfile");
//const db = knex(knexConfig.development);

const server = express();

server.use(express.json());
// server.use(cors());

//============GET ENDPOINT============//
server.get("/api/users", (req, res) => {
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
        res.status(200).send("Welcome");
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
