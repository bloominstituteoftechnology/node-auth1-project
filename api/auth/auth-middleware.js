const db = require("../users/users-model")
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
      if (!req.session || !req.session.user) {
        return res.status(401).json({message: "You shall not pass!"})
      }
      next()
    } catch (err) {
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
    const { username } = req.body
    const usernameTaken = await db.findBy({username}).first()
      if (usernameTaken) {
        return res.status(402).json({message: "Username taken"})
        
      } else {
        next()
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
    const { username } = req.body
    const usernameExists = await db.findBy({username})
      if (usernameExists) {
        req.usernameExists = usernameExists
        next()
      } else {
        return res.status(401).json({message: "Invalid credentials"})
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
    const { password } = req.body
      if (password.length < 4 || !password) {
        return res.status(422).json({message: "Password must be longer than 3 chars and must be included"})
      } else {
        next()
      }
    }
}

// Don't forget to add these to the `exports` object so they can be required in other modules
module.exports = {restricted, checkUsernameFree, checkUsernameExists, checkPasswordLength}