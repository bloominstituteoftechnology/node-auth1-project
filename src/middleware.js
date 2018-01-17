const bcrypt = require('bcrypt');
const User = require('./user');

const STATUS_USER_ERROR = 422; 

const 

const passwordEncrypt = (req, res, next) => {
    const { password } = req.body; 
    if (!password || password === '') {
      return sendUserErrore(err, res);
    }
    bcrypt 
      .hash(password, 11)
      .then((hash) => {
          req.passwordHash = hash; 
          next();
      })
      .catch((err) => {
          throw new Error(err);
      });
};

const passwordCompare = (req, res, next) => {
    const { email, password } = req.body; 
    User.findOne// email
}








