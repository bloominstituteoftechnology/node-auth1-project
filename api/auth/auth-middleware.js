const {findBy} = require("../users/users-model.js")
function restricted(req, res, next) {
    if (!req.session.user){
        res.status(401).json({message:"You shall not pass!"})
    } else{
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
async function checkUsernameFree(req, res, next) {
    const { username } = req.body
    const user = await findBy({username})
    if (user.length != 0){
        res.status(422).json({message:"Username taken"})
    } else {
        next()
    }
}


async function checkUsernameExists(req, res, next) {
    const { username } = req.body
    const user = await findBy({ username })
    if (!user){
        res.status(401).json({message:"Invalid credentials"})
    } else {
        next()
    }
}

function checkPasswordLength(req, res, next) {
    if (!req.body.password || req.body.password.length <= 3){
        res.status(422).json({message:"Password must be longer than 3 chars"})
    } else {
        next()
    }
}

module.exports = {restricted, checkPasswordLength, checkUsernameExists, checkUsernameFree}