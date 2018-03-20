/* eslint-disable */
const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const bcrypt = require("bcrypt");
const mongoose = require('mongoose');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const UserModel = require("./user");

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(session({
  secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
  resave: true,
  saveUninitialized: true,
}));

mongoose.connect("mongodb://localhost:27017/Users", {useMongoClient: true});
mongoose.connection
.once("open", () => console.log(`Mongoose is open`))
.on("error", (err) => console.log(`There was an error: \n ${err}`))

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
server.post("/users", (req, res) => {
  const newUsername = req.query.username;
  const newPassword = req.query.password;

  console.log(newUsername, newPassword);

  const newUser = new UserModel({
    username: newUsername,
    password: newPassword,
  });

  bcrypt.hash(newPassword, 10, (err, hash) => {
    console.log(hash);
    if (err) {
      res.status(500);
      res.send(`There was an error saving the user`);
    } else if (hash){
      newUser.password = hash;
      newUser.save()
      .then(response => {
        console.log(`The user was saved successfully`);
      })
      .catch(err => console.log(`There was an error saving the user: \n ${err}`));
    }
  })
})


// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
