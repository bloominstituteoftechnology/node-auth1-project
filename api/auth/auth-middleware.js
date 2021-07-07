const Users = require("../users/users-model.js")

const restricted = (req, res, next) => {
  if (req.session && req.session.user) {
    next()
  } else {
    res.status(401).json("You shall not pass!")
  }
}

const checkPayload = (req, res, next) => {
  if(!req.body.username || !req.body.password) {
    res.status(401).json("Username and password are required")
  } else {
    next()
  }
}

const checkUsernameFree = async (req, res, next) => {
  try{
    const rows = await Users.findBy({username: req.body.username})
    if(!rows.length) {
      next()
    } else {
      res.status(422).json("Username taken")
    }
  }
  catch(e) {
    res.status(500).json(`Server Error: ${e.message}`)
  }
}

const checkUsernameExists = async(req, res, next) => {
  try {
    const rows = await Users.findBy({username: req.body.username}) 
    if (rows.length) {
      req.userData = rows[0]
      next()
    } else {
      res.status(401).json("Invalid credentials")
    }
  }
  catch(e) {
    res.status(500).json(`Server Error: ${e.message}`)
  }
}

const checkPasswordLength = (req, res, next) => {
  try{
    if (!req.body.password || req.body.password.length <= 3) {
      res.status(422).json("must be longer than 3 char")
    } else {
      next()
    }
  }
  catch(e) {
    res.status(500).json(`Server Error: ${e.message}`)
  }
}

module.exports = {
  restricted,
  checkPayload,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength
}