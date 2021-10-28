const User = require('../users/users-model')
/*
  If the user does not have a session saved in the server

  status 401
  {
    "message": "You shall not pass!"
  }
*/
function restricted(req, res, next){
  if(req.session.user){
    next()
  }else{
    res.status(401).json('You shall not pass!')
  }
}

/*
  If the username in req.body already exists in the database

  status 422
  {
    "message": "Username taken"
  }
*/
async function checkUsernameFree(req, res, next){
  try{
    const rows = await User.findBy({username: req.body.username})
    if(!rows.length){
      next()
    }else{
      res.status(401).json('Username taken')
    }
  }catch(err){
    res.status(500).json(`Server error: ${err.message}`)
  }
}

/*
  If the username in req.body does NOT exist in the database

  status 401
  {
    "message": "Invalid credentials"
  }
*/
function checkUsernameExists(req, res, next){
  if(!req.body.username){
    res.status(401).json('Invalid credentials')
  }else{
    next()
  }  
}

/*
  If password is missing from req.body, or if it's 3 chars or shorter

  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
function checkPasswordLength(req, res, next){
  if(!req.body.password || req.body.password <= 3){
    res.status(422).json({message: 'Password must be longer than 3 chars'})
  }else{
    next()
  }
}

// Don't forget to add these to the `exports` object so they can be required in other modules
module.exports = {restricted, checkUsernameExists, checkUsernameFree, checkPasswordLength}