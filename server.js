const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

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
	if (req.session && req.session.username) {
		next();
	} else {
		res.status(401).send("You shall not pass!");
	}
}

const sessionConfig = {
  secret: 'do or do not, there is no try',
  cookie: {
    maxAge: 1 * 24 * 60 * 60 * 1000,
  },
  httpOnly: true,
  secure: false,
  resave: true,
  saveUninitialized: false,
  name: 'noname',
  store: new MongoStore({
    url: 'mongodb://localhost/sessions',
    ttl: 60 * 10,
  }),
};

server.use(express.json());
server.use(session(sessionConfig));

server.get('/', (req, res) => {
  if (req.session && req.session.username) {
    res.send(`Welcome back ${req.session.username}`);
  } else {
    res.send('Wrong username or password. Please try again.');
  }
});
  
server.post('/api/register', function(req, res) {
	const user = new User(req.body);
	user
		.save()
		.then(user => res.status(201).send(user))
		.catch(err =>	res.status(500).send(err))
  });
  
server.post('/api/login', (req, res) => {
	const { username, password } = req.body;
	User
		.findOne({ username })
		.then(user => {
			if (user) {
				user
				.isPasswordValid(password)
				.then(isValid => {
					if (isValid) {
						req.session.username = user.username;
						res.send('You have successfully logged in');
					} else {
						res.status(401).send('invalid password');
					}
				});
			} else {
				res.status(401).send('invalid username');
			}
		})
		.catch(err => 
			res.send(err));
});
	
server.get('/api/users', authenticate, (req, res) => {
	User
		.find()
		.then(users => {
			res.status(200).json(users);
		})
			.catch(err => {
			res.status(500).json({ errormessage: "Could not retrieve user information" })
		})
});

server.get('/api/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(function(err) {
      if (err) {
        res.send('error');
      } else {
        res.send('good bye');
      }
    });
  }
});


const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Working on ${port}...`));