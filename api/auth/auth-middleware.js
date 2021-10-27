const Users = require('../users/users-model')


function restricted(req, res, next) {
  if(req.session.user){
    next()
  }else{
    res.status(401).json("Please log in")
  }
}


async function checkUsernameFree(req, res, next) {
  try{
    const rows = await User.findBy({username:req.body.username})
    if(!rows.length){
        next()
    }else{
        res.status(401).json("Username already exists")
    }
}catch(e){
    res.status(500).json(`Server error: ${e.message}`)
}
}


function checkUsernameExists(req, res, next) {
  if(!req.body.username){
    res.status(401).json("Invalid credentials")
}else{
    next()
}
}


function checkPasswordLength(req, res, next) {
  if (!req.body.password || req.body.password <= 3){
    res.status(422).json({ message: 'Password must be longer than 3 chars'})
  } else {
    next()
  }

}

module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength
}