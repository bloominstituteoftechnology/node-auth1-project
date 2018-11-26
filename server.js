const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const helmet = require('helmet');
const morgan = require('morgan');
const db = require('./data/dbConfig.js');
const session = require('express-session');

const server = express();
server.use(express.json());
server.use(cors());
server.use(helmet());
server.use(morgan('short'));

server.use(
	session({
		name: 'notsession', // default name is connect.sid
		secret: 'nobody tosses a dwarf!',
		cookie: {
			maxAge: 1 * 24 * 60 * 60 * 1000,
			secure: true
		},
		httpOnly: true, // doesn't let JS code access cookies
		resave: false,
		saveUninitialized: false
	})
);

restricted = (req, res, next) => {
	if (req.session && req.session.username) {
		next();
	} else {
		res.status(401).json({ message: 'Invalid credentials' });
	}
};

server.get('/', (req, res) => {
	res.send('Server is running');
});

// get all user id and usernames
server.get('/users', restricted, (req, res) => {
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
		.catch((err) => res.status(400).json(err));
});

server.post('/users/login', restricted, (req, res) => {
	const creds = req.body;
	db('students')
		.where({ username: creds.username })
		.first()
		.then((user) => {
			if (user && bcrypt.compareSync(creds.password, user.password)) {
				res.status(200).json({ message: `Welcome ${user.username}` });
			} else {
				res.status(401).json({ message: 'Invalid credentials!' });
			}
		})
		.catch((err) => res.status(500).json({ err }));
});

server.listen(9000, () => console.log('this port is over 9000!'));
