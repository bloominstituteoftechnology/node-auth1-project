const codes = require("../data/statusCodes");

const express = require("express");
const session = require("express-session");

const db = require("../data/dbConfig");

const router = express.Router();
function restricted(role) {
  return function(req, res, next) {
    const accessCodes = {
      admin: 2,
      normal: 1,
      free: 0,
    };
    const userRole = req.session.user.role;
    const hasAccess = accessCodes[userRole] >= accessCodes[role] ? true : false;
    console.log(hasAccess,userRole);
    if (req.session && hasAccess) {
      next();
    } else {
      return res
        .status(codes.BAD_REQUEST)
        .json({ error: "Incorrect credentials" });
    }
  };
}
router.get("/", restricted('free'), (req, res, next) => {
  db("users")
    .then(response => {
      res.status(codes.OK).json(response);
    })
    .catch(err => {
      next(err);
    });
});

router.get("/logout", (req, res, next) => {
  if(req.session) {
    req.session.destroy(function(err) {
      if (err) {
        res.send("Logging out of session did not happen");
      }
      else {
        res.send("You are now logged out");
      }
    });
  }
})

module.exports = router;
