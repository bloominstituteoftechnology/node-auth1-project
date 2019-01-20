const express = require('express');
const route = express.Router();
const bcrypt =  require('bcryptjs');
const db = require('../dbHelpers.js');
const session = require('express-session');
const middleware = require('../middleware/custom_middleware');

const protect = (req,res,next) => {
   if(session && session.userId) {
        next();
   } else {
      res.status(404).json({errorMessage: `Access Denied`});
   }
}  

route.get('/api/users', protect, (req,res) => {
     db.findUsers()
       .then( users => {
          res.status(200).json(users)
       })
       .catch(err => {
          res.status(500).json({err:`Failed to get the all users now.`});
       })
});

module.exports = route;