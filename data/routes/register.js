const express = require('express');
const router = express.Router();
const bcrypt =  require('bcryptjs');
const db = require('../dbHelpers.js');
const middleware = require('../middleware/custom_middleware');

router.post('/api/register', 
             middleware.validateRegistration,
             middleware.hashPassword, (req,res) => {
  const user = req.body;
  // user.password = bcrypt.hashSync(user.password, 5);  
  console.log(user.password);
  if(user.username && user.password) {
  db.insertUser(user)
    .then( userIds => {
       res.status(201).json({id:userIds[0]});
    })
    .catch(err => {
       res.status(500).json({err: `Failed to register at this time - check for requirements`});
    })
  }  
});

module.exports = router;