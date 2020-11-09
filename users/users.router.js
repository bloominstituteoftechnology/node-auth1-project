const router = require("express").Router();

const Users = require("./users-model.js");

// put this middleware in a centralized location
function secure(req, res, next) {
  // check if there is a user in the session
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized!" });
  }
}

router.get("/", secure, (req, res) => {
  Users.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => res.send(err));
});

module.exports = router;
