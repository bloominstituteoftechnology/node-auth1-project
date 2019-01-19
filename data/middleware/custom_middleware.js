const bcrypt = require('bcryptjs');

const validateRegistration = (req,res,next) => {
     const user = req.body;
     const username = user.username;
     const password = user.password;
     if(!user) res.status(400).json({errorMessage:` Check either username or password is missing`});
     if(!username) res.status(400).json({errorMessage: `Please enter a valid username`});
     if(!password) res.status(400).json({errorMessage: `Please choose a valid password`});
     next();
}

const hashPassword = (req,res,next) => {
     req.body.password = bcrypt.hashSync(req.body.password, 5); 
     next();
}

module.exports = {
   validateRegistration,
   hashPassword
}