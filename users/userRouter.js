const express = require('express')
const Users = require('./users-model.js');
const bcrypt = require('bcryptjs');
const router = require('express').Router()
const restricted = require('../auth/restricted-middleware.js');
 
  

  
  router.get('/', restricted, (req, res) => {
    Users.find()
      .then(users => {
        res.json(users);
      })
      .catch(err => res.send(err));
  });
  
  

  module.exports = router