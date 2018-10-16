const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const db = require('./dbconfig');

const sessionConfig = {
	secret: 'nobody.tosses.a.dwarf.!',
	name: 'monkey', // defaults to connect.sid
	httpOnly: true, // JS can't access this
	resave: false, 
	saveUninitialized: false, // laws! (?)
	cookie: {
		secure: false, // over https
		maxAge: 1000 * 60 * 1 // ms * s * m
	},
	store: new KnexSessionStore({
		tablename: 'sessions',
		sidfieldname: 'sid',
		knex: db,  // knex db
		createtable: true, 
		clearInterval: 1000 * 60 * 60  // clear expired sessions
	})
}

module.exports = session(sessionConfig);
