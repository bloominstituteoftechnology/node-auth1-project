const express = require("express");
const server = express();
const session = require("express-session")

sessionConfig = {
    name: "asessname",
    secret: "as;lfj349iwhaakeshrhwafw9hfskdfh289",
    cookie: {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        secure: true
    },
    httpOnly: true,
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
server.get("/api/users", (req, res)=>{
    db("users").then(users=>{
        res.status(200).json(users);
    }).catch(err=>{
        return res.status(500).json({message: "A server error has occurred"});
    })
})

module.exports = server;