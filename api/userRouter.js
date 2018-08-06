const codes = require("../data/statusCodes");

const express = require("express");
const session = require('express-session');

const db = require("../data/dbConfig");

const router = express.Router();

router.get("/", (req, res, next) => {
  if(!req.session.isLoggedIn) {
    res.status(codes.BAD_REQUEST).json('You shall not pass!');
  }
  db("users")
    .then(response => {
      res.status(codes.OK).json(response);
    })
    .catch(err => {
      next(err);
    });
});
module.exports = router;
