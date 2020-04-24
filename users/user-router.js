const router = require("express").Router();
// const restricted = require('../auth/auth-middleware.js')
const Users = require("./user-model.js");

router.get("/", (req, res) => {
  Users.find()
    .then((users) => {
      res.json(users);
    })
    .catch((err) => res.sendStatus(err));
});

module.exports = router;
