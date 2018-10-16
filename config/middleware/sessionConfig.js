const session			= require('express-session');
const KnexSessionStore	= require('connect-session-knex')(session);
const db				= require('../../data/dbConfig.js');

const store = new KnexSessionStore({
	tablename: 'sessions', // Tablename to use. Defaults to 'sessions'.
	sidfieldname: 'sid', // Field name in table to use for storing session ids. Defaults to 'sid'.
	knex: db, // Instance to use. Defaults to a new knex instance, using sqlite3 with a file named 'connect-session-knex.sqlite'
	createtable: true, // If the table for sessions should be created automatically or not.
	clearInterval: 60000, // Milliseconds between clearing expired sessions. Defaults to 60000.
});

const sessionConfig = {
	name: 'auth-project',
	secret: 'This-is.the-auth.project session!',
	cookie: {
		maxAge: 1000 * 60 * 5, // 5 minutes in milliseconds
		secure: false, // if true, only set cookies over https; if false, can be done over http as well
	},
	httpOnly: true, // if true, don't let JS code access cookies for security purposes
	resave: false,
	saveUninitialized: true, // The saveUninitialized flag, forces a session that is “uninitialized” to
							// be saved to the store. A session is uninitialized when it is new but not
							// modified. Choosing false is useful for implementing login sessions
							// reducing server storage usage, or complying with laws that require
							// permission before setting a cookie.
	store: store,
};

module.exports = session(sessionConfig);
