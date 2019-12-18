const Register = require("./register-model");
const express = require("express");

const router = express.Router();

router.post("/", Register.validateReg, (req, res) => {
  Register.addUser(req.body)
    .then(user => {
      res.status(201).json({
        message: "New User created "
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Error Getting Data"
      });
    });
});

module.exports = router;
