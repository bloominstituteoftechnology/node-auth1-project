const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const bcrypt = require('bcryptjs');

const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

// Database
const db = require('./data/dbConfig.js');

const server = express();

sessionConfig = {
	secret: 'Do.Th$t.thang',
	name: 'pikachu',
	httpOnly: false,
	resave: false,
	saveUninitialized: false,
	cookie: {
		secure: false,
		maxAge: 1000 * 60 * 10,
	},
	store: new KnexSessionStore({
		tablename: 'sessions',
		sidfieldname: 'sid',
		knex: db,
		createtable: true,
		clearInterval: 1000 * 60 * 60,
	}),
};
server.use(session(sessionConfig));
server.use(express.json());
server.use(cors());
server.use(helmet());

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
			req.session.username = creds.username;
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
				req.session.username = user.username;
				res.status(200).json({ Welcome: user.username });
			} else {
				res.status(401).json({ Message: 'You shall not pass!' });
			}
		})
		.catch((err) => {
			res.status(500).json({ Message: err });
		});
});

// Users endpoint (Monday)
server.get('/api/users', (req, res) => {
	if (req.session && req.session.username) {
		db('users')
			.select('id', 'username', 'password') // never add return password in production
			.then((users) => {
				res.json(users);
			})
			.catch((err) => {
				res.status(500).json(err);
			});
	} else {
		res.status(401).send('Not authorized');
	}
});

server.get('/api/logout', (req, res) => {
	if (req.session) {
		req.session.destroy((err) => {
			if (err) {
				res.status(400).json('You shall not leave!');
			} else {
				res.status(200).json('You shall pass!');
			}
		});
	}
});
// STRETCH PROBLEM - need to finish
server.get('/api/restricted', (req, res) => {
	db('users');
});

// Server Listening
const port = 9000;
server.listen(port, () => console.log(`\nAPI running on port ${port}\n`));
