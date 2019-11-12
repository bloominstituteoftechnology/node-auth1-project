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

router.post("/", (req, res) => {
  const usersData = req.body;
  Users.add(usersData)
    .then(users => {
      res.status(201).json(users);
    })
    .catch(err => {
      res.status(500).json({ message: "Failed to create new users" });
    });
});
module.exports = router;
