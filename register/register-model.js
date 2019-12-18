const db = require("../db-config");
const bcryptjs = require("bcryptjs");
module.exports = {
  validateReg,
  addUser
};

// Add New User
function addUser(user) {
  user.password = bcryptjs.hashSync(user.password, 12);
  return db("users").insert(user);
}

// Check validate Reg.
function validateReg(req, res, next) {
  if (req.body.username && req.body.password) {
    db("users")
      .where({ username: req.body.username })
      .then(newuser => {
        console.log("username taken", newuser);
        if (newuser.length > 0)
          return res.status(404).json({
            message: "this username is taken"
          });
        return next();
      })
      .catch(error => {
        res.status(500).json({
          message: "Error Getting the Data"
        });
      });
  } else {
    res.status(404).json({
      message: "please Provide username and password"
    });
  }
}
