const express = require("express");
const server = express();
const session = require('express-session');

const sessionConfig = {
    name: 'notsession',
    secret: 'nobody tosses a dwarf!',
    cookie: {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === "production"? true: false,
        httpOnly: true
    },  
    resave: false,
    saveUninitialized: false
}

server.use(session(sessionConfig));
server.use(express.json());

server.get("/", (req, res)=>{
    res.send("the api is working");
});

//routing
const authRoutes = require("./auth/authRouter");
server.use("/api/", authRoutes);

const db = require("./data/db");

server.use(function(req, res, next){
    if(req.path.indexOf('/api/users') !== -1){
        if(req.session && req.session.user) return next();
        res.status(401).json({message: "You shall not pass!"});
    }else {
        res.status(401).json({message: "You shall not pass!"});
    };  
});

server.get("/api/users", (req, res)=>{
    db("users").then(users=>{
        res.status(200).json(users);
    }).catch(err=>{
        return res.status(500).json({message: "A server error has occurred"});
    })
});

module.exports = server;