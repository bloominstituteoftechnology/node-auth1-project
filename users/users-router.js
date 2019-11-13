const router = require("express").Router();

const Users = require("./users-model");
const requiresAuth = require("../auth/requires-auth-middleware.js");

router.get("/", requiresAuth, (req, res) => {
  Users.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

module.exports = router;
