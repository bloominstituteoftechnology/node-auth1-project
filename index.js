const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const userRouter = require('./users/user-router');
const authRouter = require('./auth/auth-router');
const server = express();
const port = process.env.PORT || 8080;

server.use(cors());
server.use(morgan('dev'));
server.use(helmet());
server.use(express.json());

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
