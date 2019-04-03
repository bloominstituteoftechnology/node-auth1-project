//server moduke
const express = require("express");
//security module
const helmet = require("helmet");
//cors?
const cors = require("cors");
//session-express module
const session = require('express-session');
//Routing 
const authRouter = require('./database/authentication/auth-router.js');
const usersRouter = require('./database/users/users-router.js');
// const sessionConfig = require('./database/authentication/session-config.js');
const sessionConfig = {
    name: 'excalibur',
    secret: 'sword of destiny',
    resave: false, //avoid recreating unchanged sessions
    saveUninitialized: false, //GDPR compliance
    cookie: {
        maxAge: 1000 * 60 * 10, //milliseconds
        secure: false, //use for https
        httpOnly:  true, //can JS access the cookie on the client
    },
};
//server initialize
const server = express();
//middleware
server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));
//Routers
server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);
//server CRUD
//root GET
server.get("/", (req, res) => {
    res.send("Server Running");
  });
//export server!
module.exports = server;