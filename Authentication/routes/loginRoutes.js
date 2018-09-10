const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../../db/dbConfig.js");
const loginRouter = express.Router();

loginRouter.post("/", (req, res) => {
  const creds = req.body;
  db("users")
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        res.status(200).send("Welcome");
      } else {
        res.status(401).json({ errorMessage: "UnAuthorized" });
      }
    })
    .catch(error => {
      res.status(500).send(error);
    });
});
module.exports = loginRouter;
