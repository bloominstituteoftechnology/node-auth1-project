const router = require("express").Router();

const Users = require("./users-model.js");

const loginCheck = require('../auth/logged-in-checked-middleware.js')

router.get("/", loginCheck, (req, res) => {
    Users.find()
          .then(users => {
                res.json(users);
          })
          .catch(err => res.send(err));
});

module.exports = router;