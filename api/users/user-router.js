const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const session = require('express-session');

const sessionConfig = {
	name: 'pecan',
	cookie: {
		maxAge: 1000 * 60 * 60,
		secure: false, //<--make sure to change true for production
		httpOnly: true,
	},
	secret: 'keep it secret, keep it safe',
	resave: false,
	saveUninitialized: true, //Laws require a check with client b4 setting
};

const restricted = require('./auth/restricted-middleware.js');
const usersRouter = require('./users/user-router.js');
const authRouter = require('./auth/auth-router.js');
const server = express();

server.use(helmet(), morgan('dev'), express.json(), session(sessionConfig));

server.use('/users', restricted, usersRouter);
server.use('/auth', authRouter);

server.get('/', (req, res) => {
	res.json('AUTH-1 IS WORKING IT IS API');
});

module.exports = server;
