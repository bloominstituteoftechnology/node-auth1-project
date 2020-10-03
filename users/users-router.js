const router = require("express").Router();
const restricted = require('../auth/retricted-middleware.js');

const Users = require("./users-model.js");

router.get("/", restricted, (req, res) => {

  Users.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => res.send(err));
});



module.exports = router;