const express = require("express");
const server = express();

server.use(express.json());

server.get("/", (req, res)=>{
    res.send("the api is working");
});

//routing
const authRoutes = require("./auth/authRouter");
server.use("/api/", authRoutes);

const db = require("./data/db");
server.get("/api/users", (req, res)=>{
    db("users").then(users=>{
        res.status(200).json(users);
    }).catch(err=>{
        return res.status(500).json({message: "A server error has occurred"});
    })
})

module.exports = server;