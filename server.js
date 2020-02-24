const express = require('express');
const restrictedRouter = require('./auth/restricted-middleware.js')

const server = express();
const authRouter = require('./auth/authRouter.js')
const userRouter = require('./users/user-router.js')
server.use(express.json())
server.use('/api', authRouter )
server.use('/api/users', restrictedRouter,userRouter)


module.exports = server;