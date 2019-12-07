//? s23
const router = require('express').Router();

//? s39
const Users = require('./users-model.js');

// ? s40 
// const authRequired = require('../auth/auth-required-middleware.js');

//? s59 import
const restricted = require('../auth/restricted-middleware.js');

// protect me 
//? s41
// router.get('/', authRequired, (req, res) => {
  //? s59a restricted
router.get('/', restricted, (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

//? s42 create db-config.js under database 


//? s24
module.exports = router