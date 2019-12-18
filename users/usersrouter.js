const express = require("express");
const helmet = require("helmet");
const Users = require("./users-model");
const restricted = require("./restricted-middleware");
router = express.Router();
router.use(helmet());

// Get All users
router.get("/", restricted, (req, res) => {
  Users.getAllUsers()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(error => {
      res.status(500).json({
        message: "Error Getting Data."
      });
    });
});

module.exports = router;
