const express = require('express');
const bcrypt = require('bcryptjs');
// const db = require('./data/dbConfig.js');
const cors = require('cors');
// PORT
const PORT = 4400;

const server = express();
server.use(express.json());
server.use(cors());

server.get('/', (req,res) => {
    res.status(200).json({Message: `Server is up and running now.`})
});
function findUser(req,res,next) {
    const username = req.body.username;
     db('clients')
     .where('username', username)
     .then( userFromDb=> {
          console.log(userFromDb[0])
         if(!userFromDb[0]) {
            res.status(404).json({Message:`${username} is not registered`})
       } else {
            req.userFromDb = userFromDb[0];
           next();
       }

    })
    .catch(err => {
res.status(500).send('Something went wrong..');
    });
 }

function checkPassword(req,res,next) {
      const user = req.body;
      const password = user.password;
      const hashPassword = req.userFromDb.password;
      console.log('password', password);
      console.log('hash',hashPassword);
      bcrypt.compare("password", hashPassword, function(err, correctPassword) {
           if(err) { res.status(404).json({Message: `Not matching`})}
           else if (correctPassword) {
                 res.json({Message: `Password Matching`})
           } else {
                 res.status(500).json({Message: `Failed to loging..something went wrong`});
           }
      });
}
 server.get('/', findUser, (req,res) => {
     res.json({Message: 'working now'});
 })
 server.post('/api/register',
            validateRegistration,
            hashPassword,
        (req,res) => {
        const user = req.body;        
        db('clients')
        .insert(user)
        .then( ids => {
            console.log(ids[0]);
            res.json(ids[0]);
        })
        .catch(err => {
            res.status(500).json({errorMessage:err});
        });
});

server.post('/api/login', 
             findUser,
             checkPassword,
            (req,res) => {
                 res.status(201).json({Message: `You are logged in now`});
           });

server.listen(PORT, ()=> {
   console.log(`Server is running at localhost://${PORT}`);
});