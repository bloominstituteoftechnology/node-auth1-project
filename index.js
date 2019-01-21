const express = require('express');
const cors = require('cors');
const bcrypt =  require('bcryptjs');
const db = require('./data/dbHelpers.js');
const server = express();
const session = require('express-session');

//PORT
const PORT = 8000;

const register = require('./data/routes/register');
// const login = require('./data/routes/login');
// const session = require('express-session');
//Middleware
server.use(express.json());
server.use(
   session({
     name: 'notsession', // default is connect.sid
     secret: 'nobody tosses a dwarf!',
     cookie: {
       maxAge: 1 * 24 * 60 * 60 * 1000       
     }, // 1 day in milliseconds
     httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
     resave: false,
     saveUninitialized: false,
   })
 );


server.use(cors());
server.use(register);

const protect = (req,res,next) => {
   if(req.session && req.session.userId) {
       next();
   } else {
      res.status(400).json({Message: `Access denied`});
  }
}



server.post('/api/login', (req,res) => {
 const credentials = req.body;
 db.findByUsername(credentials.username)
   .then( users => {
      if(users.length && bcrypt.compareSync(credentials.password, users[0].password)) {
           req.session.userId = users[0].id;
           console.log('login',req.session);
           res.status(200).json({Message: `You are logged in now.`});
      } else {
           res.status(404).json({errorMessage:`Invalid username or password`})
      }
   })
   .catch(err => {
      res.status(500).json({err: `Failed to login at this time`});
   })
});

server.post('/api/logout', (req,res) => {
  req.session.destroy( err => {
      if(err) {
         res.status(500).json({errorMessage: `Failed to logout`});
      } else {
         res.json({Message:`Logout successful`});
      }
  })
});

server.get('/api/users', protect, (req, res) => {
   console.log('session', req.session);
   db.findUsers()
            .then( users => {
               res.status(200).json(users)
            })
            .catch(err => {
                res.status(500).json({errorMessage: err});
            })
});



server.get('/', (req,res) => {
    res.status(200).json(`We are live now here.`);
});

server.listen(PORT, () => {
   console.log(`Server is running at http://localhost${PORT}`);
})
