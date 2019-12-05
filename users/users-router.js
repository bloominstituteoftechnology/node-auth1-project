//? s23
const router = require('express').Router();

//? s39
const Users = require('./users-model.js');

// ? s40 
const authRequired = require('../auth/auth-required-middleware.js');

// protect me 
//? s41
router.get('/', authRequired, (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

//? s42 create db-config.js under database 


//? s24
module.exports = router