const express = require("express");
const helmet = require("helmet");
const mongoose = require("mongoose");

const User = require("./user");

mongoose
  .connect("mongodb://localhost/authdb")
  .then(conn => console.log("\n... API Connected to Database ...\n"))
  .catch(err => console.log("\n*** ERROR Connecting to Database ***\n", err));

const server = express();

function authenticate(req, res, next) {
  User.find({ username: req.body.username }).then(matchedUser => {
    const user = matchedUser[0];
    if (user) {
      user.comparePassword(req.body.password, function(err, isMatch) {
        if (isMatch && !err) {
          return res.json({
            authenticated: isMatch,
            user: user.username,
            message: "Authentification was successful"
          });
        } else
          return res.json({
            authenticated: isMatch,
            user: user.username,
            message: "Authentification was unsuccessful"
          });
      });
      // next();
    } else
      return res.json(
        `There is no user with the username ${req.body.username}.`
      );
  });
}

server.use(helmet());
server.use(express.json());

server.get("/", (req, res) => {
  res.send({ route: "/", message: req.message });
});

server.post("/users", function(req, res) {
  const user = new User(req.body);
  user
    .save()
    .then(user => res.status(201).send(user))
    .catch(err => res.status(500).send(err));
});

server.post("/log-in", authenticate, (req, res) => {
  res.send("Welcome to the Mines of Moria");
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server up and running on ${port}`);
});
