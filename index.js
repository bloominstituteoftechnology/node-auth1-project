const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("./dbHelpers");

const server = express();
const PORT = 4045;

server.use(express.json());

server.get("/", (req, res) => {
  res.send("Yep, this is the server!");
});

server.post("/api/register", (req, res) => {
  const user = req.body;
  user.password = bcrypt.hashSync(user.password, 14);
  if (user.username && user.password) {
    db.insertUser(user)
      .then(id => {
        res.status(201).json({ message: `User created with the id of ${id}` });
      })
      .catch(err => {
        res.json(err);
      });
  } else {
    res.status(400).json({ message: "Please enter a username and password" });
  }
});

server.post("/api/login", (req, res) => {
  const user = req.body;
  db.findByUsername(user.username)
    .then(dbUser => {
      if (dbUser[0] && bcrypt.compareSync(user.password, dbUser[0].password)) {
        res.json({ message: "You have successfully logged in" });
      } else {
        res.status(404).json({ message: "You shall not pass!" });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});
