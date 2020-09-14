const express = require("express"); 
const helmet = require("helmet"); 
const cors = require("cors"); 

const usersRouter = require("../users/usersRouter"); 
const server = express(); 

server.use(express.json()); 
server.use(cors()); 
server.use(helmet()); 
//! Routers will go here !// 
server.use("/api/users", usersRouter); 

server.get("/", (req, res) => {
    res.send({ message: "Welcome to the server" }); 
}); 

module.exports = server; 
