const bcrypt = require('bcryptjs')
const router = require('express').Router()
const Users = require('../users/users-model')

// not done with cookies

router.get('/', protected, (req, res) => {
    Users.find()
      .then(users => {
        res.json(users);
      })
      .catch(err => res.send(err));
  });

  
  //middleware takes req, res, next
  //ensure user is logged in
  function protected(req, res, next){
    let {username, password} = req.headers
     if 
    (username && password){
      Users.findBy({username})
      //database queries return an array, but we are looking for an object, use .first()
      .first()
      .then(user => {
        if(user && bcrypt.compareSync(password, user.password)){
            
          next()
        } else {
        res.status(401).json({message: 'You cannot pass'})
        }
        })
        .catch(error => {
        res.status(500).json(error)
        })
        } else{
        res.status(400).json({message: 'please provide creditials'})
        }
    }

module.exports = router