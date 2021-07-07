const User = require('../users/users-model.js');

module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength
}

/*
  If the user does not have a session saved in the server

  status 401
  {
    "message": "You shall not pass!"
  }
*/
function restricted(req, res, next) {
  if (!req.session.user) {
    res.status(401).send({
      message: 'You shall not pass!'
    })
  } else {
    next()
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
  try{
    const username = req.body.username;
    const rows = await User.findBy({username:username}) 

    if (rows.length === 0) {
      next();
    } else {
      res.status(422).json({ message: "Username taken"})
    }

  } catch(err) {
    res.status(500).json( `Server error: ${err.message}` )
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
  try{
    const username = req.body.username;
    const rows = await User.findBy({username:username}) 

    if (rows.length) {
      req.userData = rows[0];
      next();
    } else {
      res.status(401).json({ message: "Invalid credentials"})
    }

  } catch(err) {
    res.status(500).json( `Server error: ${err.message}` )
  }

}

/*
  If password is missing from req.body, or if it's 3 chars or shorter

  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
const checkPasswordLength = async (req, res, next) => {
  try {
    const password = req.body.password;
    if (password.length < 3) {
      res.status(422).json({ message: "Password must be longer than 3 chars" })
    } else {
      next()
    }
  } catch (err) {
    res.status(500).json( `Server error: ${err.message}` )
  }
}

// Don't forget to add these to the `exports` object so they can be required in other modules
