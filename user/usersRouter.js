const express = require("express");

const User = require("./User");

const router = express.Router();

// /users

// POST
router.route("/").post((req, res) => {
  const { username, password } = req.body;
  const user = new User(req.body);

  user
    .save()
    .then(newUser => {
      res.status(201).json(newUser);
    })
    .catch(error => {
      res.status(500).json({
        error: "There was an error posting the new user."
      });
    });
});

module.exports = router;
