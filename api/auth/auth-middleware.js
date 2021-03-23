const {findBy} = require('../users/users-model')
/*
  If the user does not have a session saved in the server

  status 401
  {
    "message": "You shall not pass!"
  }
*/
function restricted() {
  return async (req, res, next) => {
    try {
      if(!req.session || !req.session.user) {
        return res.status(401).json({ message: "You shall not pass!" })
      } else {
        next()
      }
    } catch(err) {
      next(err)
    }
  }
}

/*
  If the username in req.body already exists in the database

  status 422
  {
    "message": "Username taken"
  }
*/
function checkUsernameFree() {
  return async (req, res, next) => {
    try {
      const checkUserName = await findBy({ username: req.body.username })
      if(checkUserName.length >= 1) {
        res.status(422).json({ message: "Username already claimed" })
      } else {
        next()
      }
    } catch(err) {
      next(err)
    }
  }
}

/*
  If the username in req.body does NOT exist in the database

  status 401
  {
    "message": "Invalid credentials"
  }
*/
function checkUsernameExists() {
  return async (req, res, next) => {
    try {
      const checkUserNameInDB = await findBy({ username: req.body.username })
      if(checkUserNameInDB.length < 1) {
        res.status(401).json({ message: "invalid credentials"})
      } else {
        next()
      }
    } catch(err) {
      next(err)
    }
  }
}

/*
  If password is missing from req.body, or if it's 3 chars or shorter

  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
function checkPasswordLength() {
  return (req, res, next) => {
    if(!req.body.password || req.body.password.length < 3) {
      res.status(422).json({ message: "password must be longer than 3" })
    } else {
      next()
    }
  }
}

// Don't forget to add these to the `exports` object so they can be required in other modules
module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength
}