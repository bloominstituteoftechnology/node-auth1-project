const User = require('../users/users-model')
const db = require('../../data/db-config')
/*
  If the user does not have a session saved in the server

  status 401
  {
    "message": "You shall not pass!"
  }
*/
const restricted = (req, res, next) => {
  if(req.session && req.session.user) {
    next()
  } else {
    res.status(401).json("You shall not pass!")
  }
}

/*
  If the username in req.body already exists in the database

  status 422
  {
    "message": "Username taken"
  }
*/
const checkUsernameFree = async (req, res, next) => {
  try {
    const user = await User.findBy({user: req.body.username})

    if(!user.length) {
      next()
    } else {
      res.status(401).json("Username taken")
    }
  } catch(err) {
    res.status(500).json(`Server error: ${err}`)
  }
}

/*
  If the username in req.body does NOT exist in the database

  status 401
  {
    "message": "Invalid credentials"
  }
*/
const checkUsernameExists = async (req, res, next) => {
  try {

    const user = await User.findBy({username: req.body.username})

    if (user.length) {
      req.userData = user[0]
      next()
    } else {
      res.status(401).json("Invalid credentials")
    }

  } catch(err) {
    res.status(500).json(`Server error: ${err}`)
  }
}

/*
  If password is missing from req.body, or if it's 3 chars or shorter

  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
const  checkPasswordLength = async (req, res, next) => {
  try {
    if (!req.body.password || req.body.password.length <= 3) {
      res.status(401).json("Password must be longer than 3 chars")
    } else {
      next()
    }
  } catch(err) {
    res.status(500).json(`Server error: ${err}`)
  }
}


// Don't forget to add these to the `exports` object so they can be required in other modules
module.exports = {
  restricted,
  checkUsernameFree,
  checkPasswordLength,
  checkUsernameExists,
}