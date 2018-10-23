const express = require('express');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

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
		maxAge: 1000 * 60 * 1, // user only log in for 1min
	},
	store: new KnexSessionStore({
		tablename: 'sessions',
		sidfieldname: 'sid',
		knex: db,
		createtable: true,
		clearInterval: 1000 * 60 * 60, // removes only expired sessions every 60mins (1hr)
	})
};
server.use(session(sessionConfig)); // use it as a middleWare

server.use(express.json());
server.use(cors());

// endpoints here
server.get('/', (req, res) => {
	res.send('It is working!');
});

server.post('/register', (req, res) => {
	const credentials = req.body; // store body of post request in credentials variable

	// hash the password
	const hash = bcrypt.hashSync(credentials.password, 14);
	credentials.password = hash; // store hashed pw on the credentials object
	
	// then save the user
	db('users')
		.insert(credentials)
		.then(ids => {
			const id = ids[0];
			req.session.username = credentials.username; // prevent user from re-registering
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

server.get('/logout', (req, res) => {
	if (req.session) {
		req.session.destroy(err => {
			if (err) {
				res.send('Unable to log out');
			} else {
				res.send('Successfully logged out');
			}
		});
	}
});

// listening port
const port = 5000;
server.listen(port, function() {
  console.log(`\n=== API listening on port ${port} ===\n`);
});