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
        req.session.username = user.username; 
        req.session.userid = user.id; 
        res.status(200).send(`Welcome ${req.session.username}`);
      } else {
        res.status(401).json({ errorMessage: "UnAuthorized at 28" });
      }
    })
    .catch(error => {
      res.status(500).json({ error });
    });
});

module.exports = loginRouter;
