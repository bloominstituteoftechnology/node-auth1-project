const express = require("express"); 
const helmet = require("helmet"); 
const cors = require("cors"); 
const session = require("express-session"); 

const authRouter = require("../auth/auth-router"); 
const usersRouter = require("../users/usersRouter"); 
const authenticateUser = require("../auth/auth-middleware"); 
const server = express(); 

const sessionConfig = {
    name: 'banana', 
    secret: 'secret-banana', 
    cookie: {
        maxAge: 1000 * 10, 
        secure: false, 
        httpOnly: true,
    },
    resave: false, 
    saveUninitialized: false,
}

server.use(express.json()); 
server.use(cors()); 
server.use(helmet()); 
server.use(session(sessionConfig)); 
//! Routers will go here !// 
server.use("/api/auth", authRouter); 
server.use("/api/users", authenticateUser, usersRouter); 

server.get("/", (req, res) => {
    res.send({ message: "Welcome to the server" }); 
}); 

module.exports = server; 
