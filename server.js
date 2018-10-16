// DEPENDENCIES
const express = require('express');
const bcrypt = require('bcryptjs');
const model = require('./data/helpers/model.js');
const session = require('express-session');

// SERVER
const server = express();

// MIDDLEWARE
const configureMiddleware = require('./middleware/middleware');
configureMiddleware(server);

// authentication
const sessionConfig = {
	secret: "I'm a secret! Shhh",
	name: 'aardvark',
	httpOnly: true,
	resave: false,
	saveUninitialized: false,
	cookie: {
		maxAge: 1000 * 60, // 1 minute for testing
		secure: false
	}
};

// login check
const restricted = (req, res, next) => {
	if (req.session && req.session.name) {
		next();
	} else {
		res.status(401).json({ error: 'Not authorized' });
	}
};

server.use(session(sessionConfig));

// ENDPOINTS
// create user
server.post('/api/register', (req, res) => {
	const credentials = req.body;
	const hash = bcrypt.hashSync(credentials.password, 12);
	credentials.password = hash;

	model
		.addUser(credentials)
		.then(id => {
			req.session.name = credentials.name;
			res.status(201).json({ newUserId: id });
		})
		.catch(err => {
			if (err.code === 'SQLITE_CONSTRAINT') {
				return res.status(409).json({ error: 'Duplicate username' });
			} else {
				return res.status(500).json(err);
			}
		});
});

// login
server.post('/api/login', (req, res) => {
	const credentials = req.body;

	model
		.login(credentials)
		.then(user => {
			if (user) {
				req.session.name = user.name;
				res.status(200).json({ success: `User ${credentials.name} logged in` });
			} else {
				res.status(401).json({ error: `invalid username or password` });
			}
		})
		.catch(err => res.status(500).json(err));
});

// logout
server.get('/api/logout/', (req, res) => {
	if (req.session) {
		req.session.destroy(err => {
			if (err) {
				res.status(500).json({ error: 'Failed to log out' });
			} else {
				res.status(201).json({ message: 'See ya later!' });
			}
		});
	}
});

// get users (must be logged in)
server.get('/api/users', (req, res) => {
	if (req.session && req.session.name) {
		model
			.getUsers()
			.then(users => {
				res.status(201).json(users);
			})
			.catch(err => res.status(500).json(err));
	} else {
		res.status(401).json({ error: 'Not authorized' });
	}
});

// global middleware check
server.get('/api/restricted/secret', restricted, (req, res) => {
	res.status(201).json({ secret: 'You are logged in!' });
});

// PORT
const port = 5000;
server.listen(port, () => {
	console.log(`\n=== Listening on http://localhost:${port} ===\n`);
});
