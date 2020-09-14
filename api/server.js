const express = require("express"); 

const helmet = require("helmet"); 
const cors = require("cors"); 

const server = express(); 

server.use(express.json()); 
server.use(cors()); 
server.use(helmet()); 
//! Routers will go here !// 

server.get("/", (req, res) => {
    res.send({ message: "Welcome to the server" }); 
}); 

module.exports = server; 
