const express = require("express"); 
const helmet = require("helmet"); 
const cors = require("cors"); 
const session = require("express-session"); 

const usersRouter = require("../users/usersRouter"); 
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
server.use("/api/users", usersRouter); 

server.get("/", (req, res) => {
    res.send({ message: "Welcome to the server" }); 
}); 

module.exports = server; 
