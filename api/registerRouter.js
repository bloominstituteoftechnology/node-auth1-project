const codes = require("../data/statusCodes");

const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../data/dbConfig");

const router = express.Router();

router.post("/", (req, res, next) => {
  const user = req.body;
  const hash = bcrypt.hashSync(user.password, 12);
  user.password = hash;
  db("users")
  .insert(user)
    .then(response => {
      res.status(codes.OK).json(response);
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
