const express = require("express");
const bcrpyt = require("bcrypt");
const knex = require("knex");
const cors = require("cors");

const knexConfig = require("./knexfile.js");
const db = knex(knexConfig.development);
const server = express();
const PORT = 3500;

server.use(express.json());
server.use(cors());

server.post("/api/login", (req, res) => {
  const creds = req.body;
  console.log(creds);
  db("users")
    .where({username: creds.username})
    .first()
    .then(user => {
      console.log("user", user);
      console.log(bcrpyt.compareSync(creds.password, user.password));
      console.log("creds", creds.password);
      console.log("hash", user.password);
      if (user && bcrpyt.compareSync(creds.password, user.password)) {
        res.status(200).json({message: "welcome!"});
      } else {
        res.status(401).json({message: "access denied..."});
      }
    })
    .catch(err => res.status(500).json(err));
});

server.post("/api/register", (req, res) => {
  const creds = req.body;

  const hash = bcrpyt.hashSync(creds.password, 8);

  creds.password = hash;

  db("users")
    .insert(creds)
    .then(ids => res.status(201).json(ids))
    .catch(err => res.status(500).json(err));
});

server.get("/api/users", (req, res) => {
  db("users")
    .select("id", "username", "password")
    .then(users => res.status(200).json(users))
    .catch(err => res.status(500).json(err));
});

server.listen(PORT, () => console.log(`PORT ${PORT}`));
