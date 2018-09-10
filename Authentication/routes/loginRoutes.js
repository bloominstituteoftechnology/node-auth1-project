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
        req.body.signedIn = true
        console.log(req.body); 
        db("users")
          .update(req.body)
          .where({username: creds.username})
          .then(count => {
            res.status(200).send(`Welcome ${creds.username}`)
          })
          .catch(error => {
            res.status(500).json({errorMessage: "UnAuthorized"})
          })
          

        res.status(200).send(`Welcome ${creds.username}`);
      } else {
        res.status(401).json({ errorMessage: "UnAuthorized at 28"});
      }
    })
    .catch(error => {
      res.status(500).json({error, errorMessage: error.message});
    });
});
module.exports = loginRouter;
