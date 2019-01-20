const express = require('express');
const router = express.Router();
const bcrypt =  require('bcryptjs');
const db = require('../dbHelpers.js');

router.post('/api/login', (req,res) => {
  const credentials = req.body;
  db.findByUsername(credentials.username)
    .then( users => {
       if(users.length > 0 && bcrypt.compareSync(credentials.password, users[0].password)) {
            req.session.userId = users[0].id;
            res.status(200).json({Message: `You are logged in now.`});
       } else {
            res.status(404).json({errorMessage:`Invalid username or password`})
       }
    })
    .catch(err => {
       res.status(500).json({err: `Failed to login at this time`});
    })
});

router.post('/api/logout', (req,res) => {
   req.session.destroy( err => {
       if(err) {
          res.status(500).json({errorMessage: `Failed to logout`});
       } else {
          res.json({Message:`Logout successful`});
       }
   })
});


module.exports = router;