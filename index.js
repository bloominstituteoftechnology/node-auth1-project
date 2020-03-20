const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const authRouter = require('./auth/auth-router');
const userRouter = require('./users/user-router');
const dbConfig = require('./database/config');

const server = express();
const port = process.env.PORT || 8080;

server.use(cors());
server.use(morgan('dev'));
server.use(helmet());
server.use(express.json());
server.use(
	session({
		name: 'token',
		resave: 'false',
		saveUninitialized: false,
		secret: process.env.COOKIE_SECRET || 'secret',
		cookie: {
			httpOnly: true
		},
		store: new KnexSessionStore({
			knex: dbConfig,
			createtable: true
		})
	})
);

server.use('/auth', authRouter);
server.use('/users', userRouter);

server.get('/', (req, res, next) => {
	res.json({
		message: 'Welcome to our API'
	});
});

server.use((err, req, res, next) => {
	console.log(err);
	res.status(500).json({
		message: 'Something went wrong'
	});
});

server.listen(port, () => {
	console.log(`Running at http://localhost:${port}`);
});
