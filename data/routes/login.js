const express = require('express');
const router = express.Router();
const bcrypt =  require('bcryptjs');
const db = require('../dbHelpers.js');
const session = require('express-session');

router.use(
   session({
     name: 'notsession', // default is connect.sid
     secret: 'nobody tosses a dwarf!',
     cookie: {
       maxAge: 1 * 24 * 60 * 60 * 1000,
       secure: true, // only set cookies over https. Server will not send back a cookie over http.
     }, // 1 day in milliseconds
     httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
     resave: false,
     saveUninitialized: false,
   })
 );


const protect = (req,res,next) => {
   if(session && session.userId) {
        next();
   } else {
      res.status(404).json({errorMessage: `Access Denied`});
   }
} 

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
 

router.get('/api/users', protect, (req,res) => {
     console.log(req.session)
     db.findUsers()
       .then( users => {
          res.status(200).json(users)
       })
       .catch(err => {
          res.status(500).json({err:`Failed to get the all users now.`});
       })
});


module.exports = router;