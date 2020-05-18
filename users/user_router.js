const bcryptjs = require("bcryptjs");
const router = require("express").Router();
const Users = require("../users/users-model.js");
const { isValid } = require("../users/users-service.js");
router.post("/register", (req, res) => {
  const credentials = req.body;
  if (isValid(credentials)) {
    const rounds = process.env.BCRYPT_ROUNDS || 8;
    // hash the password
    const hash = bcryptjs.hashSync(credentials.password, rounds);
    credentials.password = hash;
    // save the user to the database
    Users.add(credentials)
      .then(user => {
        res.status(201).json({ data: user });
      })
      .catch(error => {
        res.status(500).json({ message: error.message });
      });
  } else {
    res
      .status(400)
      .json({
        message: "please provide username and pasword and the password shoud be alphanumeric",
      });
  }
});
module.exports = router;
