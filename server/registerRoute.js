const express = require("express");
const router = express.Router();
const Register = require("./registerModel.js");

router.get("/", (req, res) => {
  Register.find({})
    .then(p => {
      res.status(200).json(p);
    })
    .catch(err => {
      res.status(500).json({ msg: "we are not able to connect you " });
    });
});

router.post("/", (req, res) => {
  newRegister = new Register(req.body);
  newRegister
    .save()
    .then(p => {
      res.status(200).json({ msg: " registered successfully ", p });
    })
    .catch(err => {
      res.status(500).json({ msg: "not able to register" });
    });
});

module.exports = router;
