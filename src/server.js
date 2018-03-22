/* eslint-disable */
const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const bcrypt = require("bcrypt");
const mongoose = require('mongoose');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

//importing models
const UserModel = require("./user");

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(session({
  secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
  resave: true,
  saveUninitialized: true,
}));

//initialized mongoose
mongoose.connect("mongodb://localhost:27017/Users", {useMongoClient: true});
mongoose.connection
.once("open", () => console.log(`Mongoose is open`))
.on("error", (err) => console.log(`There was an error: \n ${err}`))

//setup promises in mongoose
mongoose.Promise = global.Promise;

//creating middleware to check if the user is logged in
const loginMiddleware = (req, res, next) => {
  if (!req.session.loggedIn){
    console.log(`User not logged in`);
    res.status(401);
    res.send(`User not logged in`);
  } else if (req.session.loggedIn) {
    console.log(`The user is logged in and can access the data`);
    res.status(200);
    next();
  }
}

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

//handler for the users route that creates a new users and hashes their password
server.post("/users", (req, res) => {
  const newUsername = req.body.username;
  const newPassword = req.body.passwordHash;
  
  if (!newUsername || !newPassword){
    res.status(STATUS_USER_ERROR);
    res.send(`No username and/or password provided`);
    return;
  }

  const newUser = new UserModel({
    username: newUsername,
    passwordHash: newPassword,
  })
  .save()
  .then(response => {
    res.status(200);
    res.json(response);
  })
  .catch(err => {
    res.status(500);
    res.send(`There was an error on the server`);
  })
});

//handler for the log-in route
server.post("/log-in", (req, res) => {
  const loginUsername = req.body.username;
  const loginPassword = req.body.password;
  
  if (!loginUsername || !loginPassword){
    res.status(422);
    res.send(`No username and/or password provided`);
  }

  UserModel.findOne({username: loginUsername})
  .then(response => {
    console.log(response);
    if (!response){
      res.status(404);
      res.send(`No user with that username was found`);
      return;
    }

    response.checkLogin(loginPassword, (match) => {
      if (!match){
        res.status(422);
        res.send(`The password you entered was incorrect, please try again`);
      } else {
        req.session.loggedIn = true;
        res.status(200);
        res.json({success: true});
      }
    })
  })
  .catch(err => {
    res.status(500);
    res.send(`There was an error on the server`);
  });
})


// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', loginMiddleware, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };


//theatticus82/pass123