const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const errorHandler = require('../api/errorhandler.js')

const usersRouter = require('../users/users-router.js');
const authRouter = require('../auth/auth-router.js')
const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.use('/api/users', usersRouter);
server.use('/api/', authRouter);

server.get('/', (req, res) => {
    res.json({ message: 'api is up and running'});
})


//placing the error handler here just ensures that whenever next is called we make sure it goes through our error handler
server.use(errorHandler);
module.exports = server;