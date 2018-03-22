const User = require('./user');
const bcrypt = require('bcrypt');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;


const sendUserError = (err, res) => {
    res.status(STATUS_USER_ERROR);
    if (err && err.message) {
      res.json({ message: err.message, stack: err.stack });
    } else {
      res.json({ error: err });
    }
  };
  
  //*****************************MiddleWares********************/
  const hashPw = (req, res, next) => {
    console.log(req.body);
    const { password } = req.body;
    console.log(password);
    if (!password || password.length === 0) {
      sendUserError('Gimme a password.', res);
      return;
    } 
      bcrypt.hash(password, BCRYPT_COST)
      .then((Pw) => {
        req.password = Pw;
        next();
      })
      .catch((err) => {
          throw new Error(err);
      });
  };

  const loggedIn = (req, res, next) => {
      const { username } = req.session;
      if(!username) {
          sendUserError('User is not logged in', res);
          return;
      }
      User.findOne({ username })
      .then(user => {
          if(!user) res.json({ message:  'User does not exist'});
          else req.user = user;
          next();
      });
  };

  const restrictedPermissions = (req, res, next) => {
      const path = req.path;
      if (/restricted/.test(path)) {
          if(!req.session.username) {
              sendUserError('user not authorized', res);
              return;
          }
      } next();
  };
  module.exports = {
      sendUserError,
      hashedPassword,
      loggedIn,
      restrictedPermissions,
  };