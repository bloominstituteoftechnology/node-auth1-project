const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');

const db = require('./data/db');

const server = express();

server.use(express.json());


// configure express-session middleware
server.use(
  session({
    name: 'thisnotsession', // default is connect.sid
    secret: 'Be wery wery quiet...im hunting wabbit!',
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000,
      secure: false, // only set cookies over https. Server will not send back a cookie over http.
    }, // 1 day in milliseconds
    httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
    resave: false,
    saveUninitialized: true,
  })
);

server.get('/', (req, res) => {
  res.send('Hello World');
});

//********GET USERS ENDPOINT*********************
server.get('/users', (req, res) => {
	db('users').then(users=> {
		res.status(200).json(users);
	}).catch(err => res.status(500).json(err));
});

//********CREATE REGISTER ENDPOINTS*********************
server.post('/api/register', (req, res) => {
	const user = req.body;
	const hash = bcrypt.hashSync(user.password, 14);
	user.password = hash;
	db.insert(user).into('users')
	.then(ids => {
		const id = ids[0];
		req.session.name = user.name;
		res.status(201).json({ id, ...user })
	}).catch(err => res.status(500).json(err));
});


//********CREATE LOGIN ENDPOINTS*********************
server.post('/api/login', (req, res) => {
	const identity = req.body;

	db('users')
		.where({ name: identity.name})
		.first()
		.then(function(user){
			const passwordsMatch = bcrypt.compareSync(
			  	identity.password, user.password
			);
				if (user && passwordsMatch) {
					req.session.identity = user.identity;
					res.send('You are successfully logged In');
				} else {
					return res.status(401).json({ error: 'Opps..Login unsuccessful, Please try again'});
				}
		})
			.catch(function(error) {
				res.send(500).json({ error });
			})
});








const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
