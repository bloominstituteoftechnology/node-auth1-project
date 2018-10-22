const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const knex = require('knex');

const knexConfig = require('./knexfile');
const db = knex(knexConfig.development);

const server = express();

server.use(express.json());
server.use(cors());

// endpoints here
server.get('/', (req, res) => {
	res.send('It is working!');
});

server.post('/register', (req, res) => {
	const credentials = req.body;

	// hash the password
	const hash = bcrypt.hashSync(credentials.password, 14);
	credentials.password = hash;
	
	// then save the user
	db('users')
		.insert(credentials)
		.then(ids => {
			const id = ids[0];
			res.status(201).json({ newUserId: id });
		})
		.catch(err => {
			res.status(500).json(err);
		})
});

// protect this route, only authenticated users should see it
server.get('/users', (req, res) => {
	db('users')
		.select('id', 'username', 'password')
		.then(users => {
			res.json(users);
		})
		.catch(err => res.send(err));
});

// listening port
const port = 5000;
server.listen(port, function() {
  console.log(`\n=== API listening on port ${port} ===\n`);
});