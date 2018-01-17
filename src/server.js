const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const User = require('./models/user');
const bcrypt = require('bcrypt');
const { passwdBcrypt, comparePassword } = require('./middleware/middleWare.js');

const server = express();
const port = process.env.PORT || 3043;
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(session({
  secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re'
}));

// TODO: implement routes

server.post('/user/sign-up', passwdBcrypt, (req, res) => {
  const { email } = req.body;
  const { hash } = req;
  const newUser = new User({ email, password: hash });
  newUser.save((err, savedUser) => {
    if (err) res.status(422).json(err);
    res.json({ success: { savedUser: savedUser.email } });
  });
});

server.post('/user/login', comparePassword, (req, res) => {
  // use req.session.. :shrug:?
  res.json({ success: `${req.user} is currently logged in!` });
});

server.listen(port, err => {
  if (err) console.log(err);
  console.log(`server listening on ${port}`);
});
module.exports = { server };