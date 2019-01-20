const bcrypt = require('bcryptjs');

const validateRegistration = (req,res,next) => {
     const user = req.body;
     const username = user.username;
     const password = user.password;
     if(!user) res.status(400).json({errorMessage:` Check either username or password is missing`});
     if(!username) res.status(400).json({errorMessage: `Username is missing`});
     if(!password) res.status(400).json({errorMessage: `Please choose a valid password`});
     next();
}

const hashPassword = (req,res,next) => {
     req.body.password = bcrypt.hashSync(req.body.password, 5); 
     next();
}

const findUser = (req,res,next) => {
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
 
const checkPassword = (req,res,next) => {
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

 
 

module.exports = {
   validateRegistration,
   hashPassword,
   findUser,
   checkPassword,
   
}