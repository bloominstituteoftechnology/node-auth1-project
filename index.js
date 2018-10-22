const express = require('express');
const cors = require('cors');

const bcrypt = require('bcryptjs');

// Database
const db = require('./data/dbConfig.js');

const server = express();

server.use(express.json());
server.use(cors());

// Make sure server is active
server.get('/', (req, res) => {
	res.send("It's alive!!!");
});

// Register endpoint
server.post('/api/register', (req, res) => {
	const creds = req.body;

	// hash the password (Monday)
	const hash = bcrypt.hashSync(creds.password, 14);
	creds.password = hash;

	// then save the user (Tuesday)
	db('users')
		.insert(creds)
		.then((ids) => {
			const id = ids[0];
			res.status(201).json({ newUserId: id });
		})
		.catch((err) => {
			res.status(500).json(err);
		});
});

// Login endpoint
server.post('/api/login', (req, res) => {
	const creds = req.body;

	db('users')
		.where({ username: creds.username })
		.first()
		.then((user) => {
			if (user && bcrypt.compareSync(creds.password, user.password)) {
				//found user now compare password creds with user password
				res.status(200).json({ welcome: user.username });
			} else {
				res.status(401).json({ message: 'you shall not pass!' });
			}
		})
		.catch((err) => {
			res.status(500).json({ Message: err });
		});
});

// Users endpoint (Monday)
server.get('/api/users', (req, res) => {
	db('users')
		.select('id', 'username', 'password') // never add return password in production
		.then((users) => {
			res.json(users);
		})
		.catch((err) => {
			res.status(500).json(err);
		});
});

// Server Listening
const port = 9000;
server.listen(port, () => console.log(`\nAPI running on port ${port}\n`));
