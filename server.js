const express = require("express");
const server = express();

server.use(express.json());

server.get("/", (req, res)=>{
    res.send("the api is working");
});

//routing
const userRoutes = require("./users/usersRouter");
server.use("/api/users", userRoutes);

module.exports = server;