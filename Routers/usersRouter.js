const express = require("express");
const User = require("../User");
const router = express.Router();

//Middleware
function protected(req, res, next) {
  if (req.session && req.session.username) {
    next();
  } else {
    res.status(401).json({ message: "You shall not pass!" });
  }
}

router.route("/users").get(protected, (req, res) => {
  User.find()
    .select({ username: 1, _id: 0 })
    .then(users => res.json({ users }))
    .catch(err => res.status(500).json({ error: err.message }));
});

module.exports = router;
