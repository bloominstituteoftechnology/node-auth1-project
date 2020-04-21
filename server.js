const express = require('express');

const authRouter = require('./authRouter.js');
const userRouter = require('./userRouter.js');
const authentication = require('./authentication');

const server = express();


server.use(express.json());
const session = require('express-session');


// configure express-session middleware
server.use(
  session({
    name: "users",
    secret: process.env.SESSION_SECRET || "it's a secret",
    resave: false,
    saveUninitialized: process.env.SEND_COOKIES || true,
    cookie: {
        maxAge: 1000 * 60 * 10,
        secure: process.env.USE_SECURE_COOKIES || false,
        httpOnly: true}
  })
);
server.get('/', (req, res) => {
    res.status(200).json('hi')
})
server.use('/api/users',authentication,userRouter)
server.use('/api',authRouter)


module.exports = server;