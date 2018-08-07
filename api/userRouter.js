const codes = require("../data/statusCodes");

const express = require("express");
const session = require('express-session');

const db = require("../data/dbConfig");

const router = express.Router();
function restricted (req, res, next) {
  console.log(req.session)
  
  if(req.session && req.session.username) {
    next();
  } else {
    return res.status(codes.BAD_REQUEST).json({ error: 'Incorrect credentials '})
  }
}
router.get("/", restricted, (req, res, next) => {
  
  db("users")
    .then(response => {
      res.status(codes.OK).json(response);
    })
    .catch(err => {
      next(err);
    });
});
module.exports = router;
