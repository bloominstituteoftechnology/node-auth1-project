const express	= require('express');
const cors		= require('cors');
const helmet	= require('helmet');
const morgan	= require('morgan');
const session	= require('express-session');

module.exports = (server) => {
	server.use(
		express.json(),
		cors(),
		helmet(),
		morgan('tiny'),
		session({
			name: 'auth-project-session',
			secret: 'this is the auth project session!',
			cookie: {
				maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day in milliseconds
				secure: false, // only set cookies over https. Server will not send back a cookie over http
			},
			httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
			resave: false,
			saveUninitialized: false,
			}),
	);
};
