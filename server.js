const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const session = require("express-session");

const User = require("./users/User");

mongoose
  .connect("mongodb://localhost/authdb")
  .then(conn => {
    console.log("\n===connected to mongo ===\n");
  })
  .catch(err => console.log("error connecting to mongo", err));

const server = express();

function authenticate(req, res, next) {
  const authdb = mongoose.connect(`mongodb://localhost/authdb`);
  const searchUser = req.body.username;
  let passwordFlag = false;

  if (searchUser !== undefined) {
    User.find({ username: searchUser }).then(user => {
      if (user.length === 0) {
        res.status(400).send("User not in database");
      } else {
        bcrypt.compare(req.body.password, user[0].password).then(checked => {
          if (checked) next();
          else res.status(401).send("Access Denied");
        });
      }
    });
  } else {
    res.status(400).send("Must supply a username");
  }
}

server.use(express.json());

server.post("/api/users", authenticate, (req, res) => {
  User.find()
    .select("username -_id")
    .then(result => {
      res.status(201).json(result);
    });
});

server.post("/api/register", function(req, res) {
  const user = new User(req.body);

  user.save().then(user =>
    res
      .status(201)
      .send(user)
      .catch(res.status(500).send(err))
  );
});

server
  .post("/api/login", authenticate, (req, res) => {
    res.send("Welcome to the Mines of Moria");
  })

  .listen(8000, () => console.log("\n=== api running on 8k ===\n"));
