const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');

const restricted = require('../auth/restricted-Middleware.js');
const authRouter = require('../auth/auth-Router.js');
const usersRouter = require('../api/users/usersRouter.js');

// Storing sessions in db
const knexSessionStore = require('connect-session-knex')(session);

// ## COOKIES
// is a container of data
// browser will automatically send cookies on every request to the domain associated with the cookie
// client will store the cookie in a special place

// ## SESSIONS
// like a database
// used to store data on the server much like a database in the memory
const sessionConfig = {
	name: 'WhoKnows',
	secret: 'is it a secret or safe ?',
	cookie: {
		maxAge: 1000 * 60 * 60, // valid for 1min ( in milliseconds )
		secure: false, // do we send cookie over unsecure https only?
		httpOnly: true, // prevent client javascript code from access to the cookie
	},
	resave: false, // save sessions even when they have not changed
	saveUninitialized: false, // read about it on the docs to respoect GDPR

	// stores the session in the database
	store: new knexSessionStore({
		knex: require('../database/db-config'),
		tablename: 'user_sessions',
		sidfieldname: 'sid',
		createtable: true,
		clearInterval: 1000 * 60 * 60, // Delete expired sessions every 1 min
	}),
};

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

// SERVER ROUTES
server.use('/api/auth', authRouter);
server.use('/api/users', restricted, usersRouter);

server.get('/', (req, res) => {
	res.json({ api: 'up', session: req.session });
});

module.exports = server;
