const express = require("express");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const PORT = 3300;
const db = require("./data/dbConfig.js");

const server = express();

server.use(express.json());
server.use(cors());

server.post("/api/register", (req, res) => {
  const newUser = req.body;
  newUser.password = bcrypt.hashSync(newUser.password);
  db("users")
    .insert(newUser)
    .then(id => {
      res.status(201).send({ message: `id ${id} created` });
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

server.post("/api/login", (req, res) => {
  const user = req.body;
  db("users")
    .where("username", user.username)
    .then(users => {
      if (
        users.length &&
        bcrypt.compareSync(user.password, users[0].password)
      ) {
        res.status(202).json({ message: "login successful" });
      } else {
        res.status(401).json({ message: "You shall not pass!" });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

server.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
