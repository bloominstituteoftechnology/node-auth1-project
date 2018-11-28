const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv').config();
const helmet = require('helmet');
const morgan = require('morgan');
const db = require('./data/dbConfig.js');
const session = require('express-session'); // brints in session library
const knexSessionStore = require('connect-session-knex')(session);

const sessionConfig = {
	secret: `${process.env.SESSION_SECRET}`,
	name: `${process.env.SESSION_NAME}`, // defaults to connect.sid
	cookie: {
		secure: false, // over http(S) in production change to true
		maxAge: 1000 * 60 * 5
	},
	httpOnly: true, // JS can't access, only https
	resave: false,
	saveUninitialized: false, // has something to do with foreign laws
	store: new knexSessionStore({
		// creates memcache
		tablename: 'sessions', // session table name
		sidfiledname: 'sid', //session field name
		knex: db, // what database you want to knex to use
		createtable: true, // have the library create the table if there isn't one
		clearInterval: 1000 * 60 * 60 // clear every hour
	})
};

const server = express();
server.use(session(sessionConfig)); // wires up session management
server.use(express.json());
server.use(cors());
server.use(helmet());
server.use(morgan('short'));

server.get('/', (req, res) => {
	res.send('Server is running');
});

function restricted(req, res, next) {
	// if logged in
	if (req.session && req.session.userId) {
		// they're logged in, go ahead and provide access
		next();
	} else {
		// bounce them
		res.status(401).json({ message: 'Invalid credentials' });
	}
}

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

server.post('/users/login', (req, res) => {
	const creds = req.body;
	db('students')
		.where({ username: creds.username })
		.first()
		.then((user) => {
			if (user && bcrypt.compareSync(creds.password, user.password)) {
				// passwords match and user exists by that username
				req.session.userId = user.id;
				res.status(200).json({ message: 'welcome' });
			} else {
				// either username is invalid or password is wrong
				res.status(401).json({ message: 'you shall not pass' });
			}
		})
		.catch((err) => res.status(500).json({ err }));
});

// logout
server.get('/users/logout', (req, res) => {
	if (req.session) {
		req.session.destroy((err) => {
			if (err) {
				res.send('you can never logout');
			} else {
				res.send('you have logged out');
			}
		});
	}
});

server.listen(9000, () => console.log('this port is over 9000!'));
