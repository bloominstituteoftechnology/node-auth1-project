const express = require("express");
const server = express();

server.use(express.json());

server.get("/", (req, res)=>{
    res.send("the api is working");
});

//routing
const authRoutes = require("./auth/authRouter");
server.use("/api/", authRoutes);

module.exports = server;