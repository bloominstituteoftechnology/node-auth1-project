const express = require('express');
const router = express.Router();
const bcrypt =  require('bcryptjs');
const db = require('../dbHelpers.js');

router.post('/api/register', (req,res) => {
  const user = req.body;
  console.log(user);
  if(!user) res.status(400).json({errorMessage: `Please enter valid credentials`});
  if(!user.username) res.status(400).json({errorMessage: `Please enter a valid username`});
  if(!user.password) res.status(400).json({errorMessage: `Please choose a valid password`});
  user.password = bcrypt.hashSync(user.password, 5);   
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