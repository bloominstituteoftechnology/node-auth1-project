const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const db = require('./data/dbConfig.js');
const Users = require('./users/users-model.js');

const server = express();

// Middleware
server.use(helmet());
server.use(express.json());
server.use(cors());

// Get Requests
server.get('/', (req, res) => {
	res.status(201).json('Welcome to the WebAuth1 API!');
});

server.post('/api/register', (req, res, next) => {
	let user = req.body; // making the user require a username and password

	// check if required fields are valid
	if (!user.username || !user.password) {
		res.status(404).json({ message: 'No username or password submitted.' });
	}

	const hash = bcrypt.hashSync(user.password, 12); // hashing the user password
	user.password = hash; // setting the user password to the hashed password
	Users.add(user)
		.then((saved) => {
			res.status(201).json(saved);
		})
		.catch((err) => {
			res.status(500).json(err);
		});
});

server.post('/api/login', (req, res) => {
	let { username, password } = req.body;

	if (!username || !password) {
		res.status(401).json({ message: 'Invalid Credentials' });
	}

	Users.findBy({ username })
		.first()
		.then((user) => {
			if (username && bcrypt.compareSync(password, user.password)) {
				res.status(201).json({ message: 'Logged in', token: user.id });
			} else {
				res.status(404).json({ message: 'You shall not pass!' });
			}
		})
		.catch((err) => {
			res.status(500).json(err);
		});
});

function authorize(req, res, next) {
	const username = req.body['username'];
	const password = req.body['password'];

	if (!username || !password) {
		res.status(401).json({ message: 'Invalid Credentials' });
	}

	Users.findBy({ username })
		.first()
		.then((user) => {
			if (username && bcrypt.compareSync(password, user.password)) {
				next();
			} else {
				res.status(404).json({ message: 'You shall not pass!' });
			}
		})
		.catch((err) => {
			res.status(500).json(err);
		});
}

server.get('/api/users', authorize, (req, res) => {
	Users.find()
		.then((data) => {
			res.status(201).json(data);
		})
		.catch((err) => {
			res.status(500).json(err);
		});
});

// server listening on the port
const port = 5000;
server.listen(port, function() {
	console.log(`\n Server is listening on port ${port} \n`);
});
