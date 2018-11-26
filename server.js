const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const helmet = require('helmet');
// const morgan = require('morgan');
const db = require('./data/dbConfig.js');

const server = express();
server.use(express.json());
server.use(cors());
server.use(helmet());
// server.use(morgan('short'));

server.get('/', (req, res) => {
	res.send('Server is running');
});

// get all user id and usernames
server.get('/users', (req, res) => {
	db('students')
		.select('id', 'username')
		.then((student) => res.status(400).json(student))
		.catch((err) => res.status({ message: 'error getting that data', err }));
});

// register a user by username and password
server.post('/users/register', (req, res) => {
	const creds = req.body;
	const hash = bcrypt.hashSync(creds.password, 14);
	creds.password = hash;
	db('students')
		.insert(creds)
		.then((ids) => {
			res.status(201).json(ids);
		})
		.catch((err) => json(err));
});

server.listen(9000, () => console.log('this port is over 9000!'));
