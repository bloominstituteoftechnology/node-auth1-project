const router = require("express").Router();

const Users = require("./users-model.js");
const restricted = require("../auth/restricted-middleware.js");

// This endpoint needs to be restricted unless user provides
// the right credentials in the headers
router.get("/", restricted, withRole("ta"), async (req, res) => {
  try {
    const users = await Users.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
});

function withRole(role) {
  return function(req, res, next) {
    if (
      req.decodedJwt &&
      req.decodedJwt.roles &&
      req.decodedJwt.roles.includes(role)
    ) {
      next();
    } else {
      res.status(403).json({ message: `Must be a ${role} to access this` });
    }
  };
}

module.exports = router;
