const Users = require("../users/users-model.js")

const restricted = (req, res, next) => {
  if (!req.session) {
    res.status(401).json("Unauthorized access attempted")
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
    if (!rows.length) {
      res.status(401).json("Invalid credentials")
    } else {
      next()
    }
  }
  catch(e) {
    res.status(500).json(`Server Error: ${e.message}`)
  }
}

const checkPasswordLength = (req, res, next) => {
  try{
    if (!req.body.password || req.body.password.length <= 3) {
      res.status(422).json("Password must be longer than 3 char")
    } else {
      next()
    }
  }
  catch(e) {
    res.status(500).json(`Server Error: ${e.message}`)
  }
}

// Don't forget to add these to the `exports` object so they can be required in other modules
module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength
}