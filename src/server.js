const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const port = process.env.PORT || 3043; 
const server = express();
server.use(bodyParser.json());
const Schema = mongoose.Schema({
const UserSchema = Schema({ 
  email: {
    type: String, 
    required: true, 
    unique: true
  }, 
  password: {
    type: String, 
    required: true
  }
});

const model = mongoose.model('User', UserSchema);
//pre save hooks 

server.use(
  session({
    secret: 'grizzlybear',
    resave: false, 
    saveUninitialized: true
  })
);

server.listen(3000, () => {
  console.log('Listening to 3000');
});


//pre save hooks 
const User = mongoose.model('User',UserSchema);

mongoose.Promise = global.Promise; 
mongoose.connect('mongodb://localhost/bcrypt-users', { useMongoClient: true });

/*  #################### Middlewares ######################## */

const passwordEncrypt = (req, res, next) => {
  const { password } = req.body; 
  bcrypt
    .hash(password, 11)
    .then(hash => {
      req.hash = hash; 
      next();
    })
    .catch(err => {
       throw new Error(err);
    });
  };
 
 const passwordCompare = (req, res, next) => {
   const { email, password } = req.body; 

/* ###################### API #################### */

server.post('/user/sign-up', passwordEncrypt, (req, res) => {
  const { email } = req.body;
  const { hash } = req;
  const newUser = new User({ email, password: hash });
  User.save((err, savedUser) => {
    if (err) res.status(422).json(err);
    res.json({ success: { savedUser: savedUser.username } });
  });
});
    
server.post ('/user/log-in', (req, res) => {
  const { email, password } = req.body; 
  // use req.session.. 
  // if in db, send info back to client, 
  // else sendUserError
});

server.listen(port, err => {
  if (err) console.log(err);
  console.log('server listening on ${port}');
});