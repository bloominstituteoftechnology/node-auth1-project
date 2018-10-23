const express = require('express');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcryptjs');
const session = require('express-session');

const knexConfig = require('./knexfile');
const db = knex(knexConfig.development);

const server = express();

const protected = (req, res, next) => {
	if (req.session && req.session.username) {
		next();
	} else {
		res.status(401).json({ message: 'You are not logged in' });
	}
};

const sessionConfig = {
	secret: 'yabba-#dabba%.doo!', 
	name: 'monkey', // defaults to connect.sid (sessionId)
	httpOnly: true, // JS can't access this
	resave: false,
	saveUninitialized: false, // laws!
	cookie: {
		secure: false, // over httpS
		maxAge: 1000 * 60 * 1,
	},
};
server.use(session(sessionConfig)); // use it as a middleWare

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

server.post('/login', (req, res) => {
	const creds = req.body;

	db('users')
		.where({ username: creds.username })
		.first()
		.then(user => {
			if (user && bcrypt.compareSync(creds.password, user.password)) {
				// found the user
				req.session.username = user.username;
				res.status(200).json({ welcome: user.username });
			} else {
				res.status(401).json({ message: 'username or password is incorrect' });
			}
		})
		.catch(err => res.status(500).json({ err }));
});

// protect this route, only authenticated users should see it
server.get('/users', protected, (req, res) => {
	// only if the device is logged in
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