const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const SessionStore = require('connect-session-knex')(session);

const authRouter = require('../auth/auth-router.js'); // Routes for authentication
const usersRouter = require('../users/users-router.js'); // Routes for users authorized

const server = express();
const sessionConfig = {
	name: 'auth',
	secret: 'sweet caroline',
	resave: false,
	saveUnitialized: false,
	cookie: {
		maxAge: 1000 * 60 * 60,
		secure: false,
		httpOnly: true
	},
	store: new SessionStore({
		knex: require('../data/dbConfig.js'),
		tablename: 'sessions',
		sidfieldname: 'sid',
		createtable: true,
		clearInterval: 60 * 60 * 1000
	})
};

// Server Middleware Start //
server.use(session(sessionConfig));
server.use(helmet());
server.use(express.json());
server.use(cors());

server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);
// END //

server.get('/', (req, res) => {
	// Basic route saying the API is ONLINE
	res.json({ api: 'ONLINE' });
});

module.exports = server;
