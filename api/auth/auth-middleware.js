const { findBy } = require("../users/users-model")

function restricted() {
  return async (req, res, next) => {
    try {
      if(!req.session || !req.session.user) {
        return res.status(401).json({
          message: "You shall not pass!"
        })
      }
      next()
    } catch(err) {
        next(err)
    }
  }
}

function checkUsernameFree() {
  return async (req, res, next) => {
    try {
      const { username } = req.body
      const user = await findBy({ username }).first()

      if(user) {
        return res.status(422).json({
          message: "Username taken"
        })
      }
    } catch(err) {
        next(err)
    }
  }
}

function checkUsernameExists() {
  return async (req, res, next) => {
    try {
      if(!req.body.username){
        res.status(401).json({
          message: "Invalid credentials"
        })
      }
    } catch(err) {
        next(err)
    }
  }
}

function checkPasswordLength() {
  return (req, res, next) => {
    try {
      if(!req.body.password || req.body.password.length <= 3){
        res.status(422).json({
          message: "Password must be longer than 3 chars"
        })
      }
    } catch(err){
        next(err)
    }
  }
}

module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength
}