const router = require("express").Router();

const Users = require("./users-model");
const authRequired = require("../auth/auth-required-middleware");

router.get("/users", authRequired, (req, res) => {
  Users.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => res.status(500).json({ message: "Could not get user" }));
});

module.exports = router;
