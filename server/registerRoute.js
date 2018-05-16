const express = require("express");
const router = express.Router();
const Register = require("./registerModel.js");

function verification(req, res, next) {
  if (req.session && req.session.username) {
    next();
  } else {
    res.json(
      " you are not allowed , you have to login first..... GET LOST  !!!!!!!!"
    );
  }
}

router.get("/", (req, res) => {
  Register.find({})
    .then(p => {
      res.status(200).json(p);
    })
    .catch(err => {
      res.status(500).json({ msg: "we are not able to connect you " });
    });
});

router.post("/", verification, (req, res) => {
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
