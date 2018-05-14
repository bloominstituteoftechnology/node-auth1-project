const express = require('express');
const mongoose = require('mongoose');

const User = require('./users/User');

mongoose
  .connect('mongodb://localhost/userdb')
    .then(mongo => {
      console.log('Connected to database');
    })
    .catch(err => {
      console.log('Error connecting database', err)
    })

const server = express();

function authenticate(req, res, next) {
	if (req.body.password === 'mellon') {
		next();
	} else {
			res.status(401).send('You shall not pass!');
	}
}

server.use(express.json());
  
server.post('/register', function(req, res) {
	const user = new User(req.body);
	user
		.save()
		.then(user => res.status(201).send(user))
		.catch(err =>	res.status(500).send(err))
  });
  
  server.post('/login', authenticate, (req, res) => {
    res.send('Login Successful');
	});
	
	server.get('/', (req, res) => {
		User
			.find()
			.then(users => {
				res.status(200).json(users);
			})
			.catch(err => {
				res.status(500).json({ errormessage: "Could not retrieve user information" })
			})
		});


const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Working on ${port}...`));