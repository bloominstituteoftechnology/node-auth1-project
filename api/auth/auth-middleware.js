const User = require('../users/users-model')

/*
  If the user does not have a session saved in the server

  status 401
  {
    "message": "You shall not pass!"
  }
*/

function restricted(req, res, next) {
  console.log('restricted function in auth-middleware.js')
  next()
  }

/*
  If the username in req.body already exists in the database

  status 422
  {
    "message": "Username taken"
  }
*/
async function checkUsernameFree(req, res, next) {
  try {
    const users = await User.findBy({ username: req.body.username })
    if (!users.length) {
      next()
    }
    else {
      next ({ message: "Username taken", status: 422 })
    }
    } catch (error) {
      //res.status(500).json({message: 'Something went wrong'})
      next(error) //error handling middleware in server.js, if there was none
      //it would use express's default error handling middleware and send back a 500/Internal Server Error
    }
}

/*
  If the username in req.body does NOT exist in the database

  status 401
  {
    "message": "Invalid credentials"
  }
*/
async function checkUsernameExists(req, res, next) {
    try {
      const users = await User.findBy({ username: req.body.username })
      if (users.length) {
        next()
      }
      else {
        next ({ message: "Invalid credentials", status: 401 })
      }
      } catch (error) {
        //res.status(500).json({message: 'Something went wrong'})
        next(error) //error handling middleware in server.js, if there was none
        //it would use express's default error handling middleware and send back a 500/Internal Server Error
      }
}

/*
  If password is missing from req.body, or if it's 3 chars or shorter

  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
function checkPasswordLength(req, res, next) {
  next()
}

// Don't forget to add these to the `exports` object so they can be required in other modules
module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength
}
