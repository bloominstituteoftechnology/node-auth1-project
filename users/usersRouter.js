const express = require("express");
const router = express.Router();
const Users = require("./users-model");
const restrict = require("../middlewares/authMiddleware");

router.get("/", (req, res) => {
  Users.getUsers()
    .then(users => {
      res.status(200).json({ users });
    })
    .catch(err => {
      res.status(500).json({ message: "Problem fetching users" });
    });
});

// GET request to test restricted middleware.
router.get("/restricted", restrict, (req, res) => {
  try {
    res.status(200).json({ message: "yay,  you can see users" });
  } catch {
    res.status(500).json({ message: "Access Denied" });
  }
});

module.exports = router;
