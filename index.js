const express = require('express');
const helmet = require('helmet');
// const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const db = require('./data/dbConfig.js');
const Users = require('./userHelper/userHelpers');

const server = express();

const sessionConfig = {
	name: 'auth-i_session',
	secret: 'Shhhhhhhhhh',
	cookie: {
		maxAge: 1000 * 60 * 60,
		secure: false,
	},
	httpOnly: true,
	resave: false,
	saveUninitialized: false,

	store: new KnexSessionStore({
		knex: db,
		tablename: 'sessions',
		sidfieldname: 'sid',
		createTable: true,
		clearInterval: 1000 * 60 * 60,
	}),
};

server.use(helmet());
server.use(express.json());
// server.use(cors());
server.use(session(sessionConfig));

const auth = (req, res, next) => {
	const { username, password } = req.body;

	Users.findBy({ username })
		.first()
		.then(user => {
			if (user && bcrypt.compareSync(password, user.password)) {
				req.session.user = user;
				return next();
			} else {
				res.status(401).json('invalid creds');
			}
		})
		.catch(err => res.status(500).json('server error'));
};

const restricted = (req, res, next) => {
	console.log(req.session);
	if (req.session && req.session.user) {
		next();
	} else {
		res.status(401).json({ message: 'You shall not pass!' });
	}
};

server.get('/', (req, res) => {
	res.send("It's alive!");
});

server.post('/api/register', (req, res) => {
	let user = req.body;

	const hash = bcrypt.hashSync(user.password, 10);
	user.password = hash;

	Users.add(user)
		.then(newUser => {
			req.session.user = newUser;
			res.status(201).json(newUser);
		})
		.catch(err => res.status(500).json(err));
});

server.post('/api/login', auth, (req, res) => {
	let user = req.body;

	Users.find(user)
		.then(authenticatedUser => {
			res.status(201).json(authenticatedUser);
		})
		.catch(err => res.json(err));
});

server.get('/api/users', restricted, (req, res) => {
	Users.find()
		.then(users => {
			res.json(users);
		})
		.catch(err => res.send(err));
});

server.get('/api/logout', (req, res) => {
	if (req.session) {
		req.session.destroy(err => {
			if (err) {
				res.send(
					'you can checkout any time you like, but you can never leave....',
				);
			} else {
				res.send('bye, thanks for playing');
			}
		});
	} else {
		res.end();
	}
});

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));
