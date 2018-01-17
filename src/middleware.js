const bcrypt = require('bcrypt');
const User = require('./user');

const STATUS_USER_ERROR = 422; 


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

const restricted = {req, res, next} => {
    const { path } = req; 
    console.log('RESTRICTED', req.session);
    const { username } = req.session; 
    if (/restricted/.test(path)) {
        if (!username) {
            return sendUserError('YOU ARE NOT AUTHORIZED!', res);
        }
    }
    next();
}

module.exports = {
  passwordEncrypt, 
  passwordCompare, 
  sendUserError, 
  UserLoggedIn, 
  restricted
};






