const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');


const usersRouter = require('./users/users-router');
const authRouter = require('./auth/auth-router.js');
const loginRouter = require('./login/login-router.js');


const authenticator = require("./auth/authenticator.js")

const server = express();

const sessionConfig ={
    name: "bob",
    secret: process.env.SESSION_SECRET || "bob is a bad username",
    resave: false,
    saveUninitialized: process.env.SEND_COOKIES || true,
    cookie: {
        maxAge: 1000 * 30, 
        secure: process.env.USE_SECURE_COOKIES || false, 
        httpOnly: true, 
    }
}


server.use(helmet());
server.use(express.json());
server.use(cors());

server.use(session(sessionConfig));

server.use("/api/users", authenticator, usersRouter);
server.use("/api/auth", authRouter)
server.use("/api/login", loginRouter)
server.get("/", (req, res) =>{
    res.status(200).json({message: `The Server is Up and Running!!!!`})
})
module.exports = server;
