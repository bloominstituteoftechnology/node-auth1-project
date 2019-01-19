const express = require('express');
const bcrypt =  require('bcryptjs');
const db = require('./data/dbHelpers.js');
// const middleware = require('./data/middleware/custom_middleware.js');
const cors = require('cors');

//PORT
const PORT = 8000;
//Service
const service = express();
//Middleware
service.use(express.json());
service.use(cors());

service.get('/', (req,res) => {
    res.status(200).json(`We are live now here.`);
});

service.post('/api/register', (req,res) => {
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
         res.status(500).json({err: `Failed to register at this time`});
      })
    }  
});

service.post('/api/login', (req,res) => {
     const credentials = req.body;
     
     db.findByUsername(credentials.username)
       .then( users => {
          if(users.length > 0 && bcrypt.compareSync(credentials.password, users[0].password)) {
               res.status(200).json({Message: `You are logged in now.`});
          } else {
               res.status(404).json({errorMessage:`Invalid username or password`})
          }
       })
       .catch(err => {
          res.status(500).json({err: `Failed to login at this time`});
       })
})



service.listen(PORT, () => {
   console.log(`Server is running at http://localhost${PORT}`);
})
