const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const User = require('./UserModel.js'); //connecting with schema

//making sure mongoose works
mongoose.connect('mongodb://localhost/cs10').then(() => {
  console.log('\n*** Connected to database ***\n');
})
  .catch(err => {
    console.log('error connecting to database');
});

const server = express();
server.use(express.json());

//testing to show that server is running
server.get('/', (req, res) => {
  res.status(200).json({ api: 'running...' });
});

//need GET endpoint for /api/users that will only show array of users if logged in. Verify password is hashed before saved.

//POST endpoint creating user inside body
//hashing takes place in pre-function located in schema
server.post('/api/register', (req, res) => {
  const user = new User(req.body);
  user.save()
    .then(user => {
      res.status(201).json(user);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

//POST endpoint using credentials to login the user
//need to figure out how to create new session for user with cookie containing userid.
server.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  User.findOne({ username }) //query middleware
    .then(user => {
    if (user) {
    //compare passwords
    user.isPasswordValid(password)
      .then(isValid => {
	if (isValid) {
	   res.status(200).json('Logged In');
	} else {
	  res.status(401).send('You shall not pass!'); //username does not exist
	}
      });
  } else {
    res.status(401).json('You shall not pass!'); //password incorrect
  }
    })
    .catch(err => res.send(err));
});

server.listen(8000, () => {
  console.log('\n*** API running on port 8000 ***\n');
});
