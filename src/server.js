//Now start editing `src/server.js`. Note that we've provided you a helper
//function `sendUserError()` that can send down either an object error or a string
// error. You'll use this liberally in your routes.

// We've also gone ahead and initialized the express-session middleware so you can
// use the client-specific, persistent `req.session` object in your route handlers.const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(session({
  secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re'
}));

/* Sends the given err, a string or an object, to the client. Sets the status
 * code appropriately. */
const sendUserError = (err, res) => {
  res.status(STATUS_USER_ERROR);
  if (err && err.message) {
    res.json({ message: err.message, stack: err.stack });
  } else {
    res.json({ error: err });
  }
};

// TODO: implement routes
server.post ('/user', userName(req, res))
server.post ('/user', userName)
server.get ('/user', userName)
server.post ('/server', passwordCreate)
server.get ('/server', password)


// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', (req, res) => {
  const userName = require('../models/username');
  module.exports = userName = (req, res) => {
     const {title, userName} = req.body;
     const userName = new userName()
     userName.save({title, userName}) 
       .then(
           (results) => {
             //do something here are the results
             res.status(200).json(results)
             console.log('user has created userName');
           }
         )
       .catch((err) => {
           //do something theres be an error
           res.status(500).json(err)
           console.log('problem creating new userName');
       })
       .next. 
 
 } 

  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
