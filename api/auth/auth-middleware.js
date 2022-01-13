const Users = require('../users/users-model')
const db = require('../../data/db-config')

/*
  If the user does not have a session saved in the server

  status 401
  {
    "message": "You shall not pass!"
  }
*/
function restricted(req,res,next) {
  if(req.session && req.session.user){
    next()
  } else {
    res.status(401).json("You shall not pass")
  }
}

/*
  If the username in req.body already exists in the database

  status 422
  {
    "message": "Username taken"
  }
*/
function checkUsernameFree(req, res, next) {
  Users.findBy({username: req.body.username})
    .then(user => {
      if(!user.length){
        next()
      } else {
        res.status(422).json({message: 'Username taken'})
      }
    })
}

/*
  If the username in req.body does NOT exist in the database

  status 401
  {
    "message": "Invalid credentials"
  }
*/
function checkUsernameExists(req, res, next) {
  const {username} = req.body;
  Users.findBy({username: req.body.username})
    .then(users => {
      if(users.length){
        req.userData = users[0]
        next()
      } else {
        res.status(401).json({message: 'Invalid credentials'})
      }
    })
}

/*
  If password is missing from req.body, or if it's 3 chars or shorter

  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
function checkPasswordLength() {
  const {password} = req.body;
  if(!password || password.length <= 3){
    res.status(422).json({message: 'Password must be longer than 3 chars'})
  }
}

module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength
}
// Don't forget to add these to the `exports` object so they can be required in other modules
