const db = require("../db/dbConfig");

function signedInOrNot(req,res,next){
  const username = req.body; 
  db('users')
    .where({username, signedIn: true})
    .then(user => {
      if(user){
        req.body.restricted = false // provide access. 
      } else {
        req.body.restricted = true // deny access
      }
    })
    .catch(error => {
      res.status(500).json(error)
    })
}




module.exports = signedInOrNot;