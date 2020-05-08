const express = require("express");
const Users = require("./users-model");

const router = express.Router();

router.get("/", (req, res) => {
  Users.find()
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      res.status(500).json({
        errorMessage: "Ooops! Something went wrong",
      });
    });
});

module.exports = router;
