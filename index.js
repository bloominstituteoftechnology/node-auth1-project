const server = require('./server.js');
const express = require('express');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const knex = require('knex');
const knexConfig = require('./knexfile.js');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

// connect to the database
const db = knex(knexConfig.development);

const sessionConfig = {
	name: 'monkey', // default is sid
	secret: 'joqiej;lksdjfoifoierqeoiausa9879*a96876relhjlkn&&T*&^%*yogfhldkj',
	cookie: {
		maxAge: 1000 * 60 * 5, // in miliseconds
		secure: false, // only send the cookie over https, should be true in production
	},
	httpOnly: true, // js can't touch this,
	resave: false,
	saveUninitialized: false,
	store: new KnexSessionStore({
		tablename: 'sessions',
		sidfieldname: 'sid',
		knex: db,
		createtable: true,
		clearInterval: 1000 * 60 * 10,
	}),
};


server.use(helmet());
server.use(express.json());
server.use(session(sessionConfig));

// server.post('/api/register', (req, res) => {

//   const {userName, password} = req.body;

//   db('users')
//     .insert({userName, password})
//     .then(ids => {
//       db('cohorts')
//         .where({ id: ids[0] })
//         .then(cohort => {
//           res.status(201).json(cohort);
//         });
//     })
//     .catch(err => res.status(500).json(err));
// })

// server.post('/api/login', (req, res) => {

// })

// server.get('/api/users', (req, res) => {
//   db('users')
//   .then(users => {
//     res.status(200).json(users);
//   })
//   .catch(err => res.status(500).json(err));
// })

/////////////////////////////////////

server.get('/', (req, res) => {
	res.send('sanity check');
});

server.post('/register', (req, res) => {
	const userInfo = req.body;

	const hash = bcrypt.hashSync(userInfo.password, 12);

	userInfo.password = hash;

	db('users')
		.insert(userInfo)
		.then(ids => {
			res.status(201).json(ids);
		})
		.catch(err => res.status(500).json(err));
});

server.post('/login', (req, res) => {
	const creds = req.body;

	db('users')
		.where({ username: creds.username })
		.first()
		.then(user => {
			if (user && bcrypt.compareSync(creds.password, user.password)) {
				req.session.user = user;
				res.status(200).json({ message: `welcome ${user.name}` });
			} else {
				res.status(401).json({ you: 'shall not pass!!' });
			}
		})
		.catch(err => res.status(500).json(err));
});

function protected(req, res, next) {
	if (req.session && req.session.user) {
		next();
	} else {
		res.status(401).json({ message: 'you shall not pass, not authenticated' });
	}
}

// protect this endpoint so only logged in users can see it
server.get('/users', protected, async (req, res) => {
	const users = await db('users');

	res.status(200).json(users);
});

server.get('/logout', (req, res) => {
	if (req.session) {
		req.session.destroy(err => {
			if (err) {
				res.status(500).send('you can never leave');
			} else {
				res.status(200).send('bye bye');
			}
		});
	} else {
		res.json({ message: 'logged out already' });
	}
});

module.exports = server;