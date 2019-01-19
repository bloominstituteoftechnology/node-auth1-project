const express = require('express');
const route = express.Router();
const bcrypt =  require('bcryptjs');
const db = require('../dbHelpers.js');

route.get('/api/users', (req,res) => {
     db.findUsers()
       .then( users => {
          res.status(200).json(users)
       })
       .catch(err => {
          res.status(500).json({err:`Failed to get the all users now.`});
       })
});

module.exports = route;