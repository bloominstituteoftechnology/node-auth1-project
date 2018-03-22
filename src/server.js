const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const User = require('./user.js');
const middleware = require('./middlewares');
const cors = require('cors');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const corsOptions = {};

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(session({
  secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
  resave: true,
  saveUninitialized: true
}));

server.use(cors());
server.use(middleWare.restrictedPermissions);

//*************** Routes ********************/
/* Sends the given err, a string or an object, to the client. Sets the status
 * code appropriately. */


// TODO: implement routes

server.get('/', (req, res) => {
  res.json({ message: 'API running...' });
});

server.post('/users', middlewares.hashPw, (req, res) => {
  const { username} = req.body;
  const passwordHash = req.password;
  // console.log(req.body);
  const user = new User({ username, passwordHash });
  user.save((err, savedUser) => {
    if (err || !savedUser) {
      res.status(422);
      res.json({ 'Need both usernname and password fields': err.message });
      return;
    } 
      res.json(savedUser);
  });
});

server.post('/log-in', (req, res) => {
  const {username, password } = req.body;
  if (!username) {
   middlewares.sendUserError('username undefined', res);
    return;
  }
  User.findOne({username}, (err, user) => {
    if(err || user === null) {
      middlewares.sendUserError('No user found with that name', res);
      return;
    }
    const hashedPw = user.passwordHash;
    bcrypt.compare(password, hashedPw)
    .then(response => {
      if(!response) throw new Error();
      req.session.username = username;
      req.user = user;
    })
    .then(() => {
      res.json({success: true });
    })
    .catch(err => {
      return middlewares.sendUserError('User doesnot exist', res);
  });
  });
});

server.post('/logout',(req, res) => {
  if(!req.session.username) {
    middlewares.sendUserError('User is not logged in', res);
    return;
  }
  req.session.username = null;
  res.json(req.session);
});

server.get('/restricted/users', (req,res) => {
  User.find({}, (err, users) => {
    if(err) {
      middlewares.sendUserError('500', res);
      return;
    }
    res.json(users);
  })
});

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me',sendUserError, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json({ user: req.user, session: req.session });
  
});

module.exports = { server };
