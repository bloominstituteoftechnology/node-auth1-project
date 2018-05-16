const express = require("express");
const router = express.Router();
const Register = require("./registerModel.js");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

router.get("/", (req, res) => {
  res.status(200).json({ msg: "welcome to login" });
});

// function authentication(req, res, next) {
//   Register.find({ username: req.body.username }).then(users => {
//     const userPassword = users[0].password;
//     bcrypt.compare(req.body.password, userPassword, (err, result) => {
//       if (err) {
//         res.send(err);
//       }
//       if (result) {
//         next();
//       } else {
//         res.send(" you can not pass , your password is incorrect");
//       }
//     });
//   });
// }

// router.post("/", authentication, (req, res) => {
//   const { username, password } = req.body;

//   res.status(200).json({ username: username, password: password });
// });

router.post("/", (req, res) => {
  const { username, password } = req.body;

  Register.findOne({ username })
    .then(p => {
      if (p) {
        p
          .isPasswordValid(password)

          .then(result => {
            if (result) {
              req.session.username = p.username;

              res.status(200).json("login successful, we have a cookie asWell");
            } else {
              res.status(401).json("invalid password");
            }
          });
      } else {
        res.status(401).json("invalid username");
      }
    })
    .catch(err => res.json(err));
});

module.exports = router;
