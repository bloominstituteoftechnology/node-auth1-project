const validateRegistration = (req,res,next) => {
     const user = req.body;
     const username = user.username;
     const password = user.password;
     if(!username) res.status(400).json({errorMessage: `Please enter a valid username`});
     if(!password) res.status(400).json({errorMessage: `Please choose a valid password`});
     next();
}

module.exports = {
   validateRegistration
}