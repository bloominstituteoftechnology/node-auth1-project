//server module, router extension
const router = require("express").Router();
//database module
const Users = require("./users-model.js");
const restricted = require("../authentication/restricted-middleware.js");

//GET users with user credentials
router.get(
  "/",
  restricted,
  //ONLY for specific user
  //  only('Meow'),
  (req, res) => {
    Users.find()
      .then(users => {
        res.json(users);
      })
      .catch(err => res.send(err));
  }
);

//export router!
module.exports = router;
