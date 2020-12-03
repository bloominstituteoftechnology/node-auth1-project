const express = require("express");
const router = express.Router();
const { restrictedUsers } = require("../middleware/restricted-middleware");

const Users = require("./users-model");

//GET /api/users
router.get("/", restrictedUsers(), (req, res) => {
  Users.find()
    .then((users) => {
      console.log(users, "users in /api/users");
      res.json(users);
    })
    .catch((err) => {
      console.log(err, "error in getting users");
      res.json({ error: "error here" });
    });
});

module.exports = router;
