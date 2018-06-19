const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");

const User = require("./UserModel");
const restrictedRouter = require("./restrictedRouter");
const unrestrictedRouter = require("./unrestrictedRouter");
const server = express();

mongoose.connect("mongodb://localhost:27017/userAuthdb")
    .then(() => {
        console.log('\n*** Connected to database ***\n');
    })
    .catch(err =>{
        console.log(err.message);
    });

//middleware

const sessionOptions = {
    secret: "You're killing me, Smalls...",
    cookie: {
        maxAge: 60*60*1000 //1 day
    },
    httpOnly: true,
    secure: false,
    saveUninitialized: true,
    resave: true,
    name: "yadayadayada"
}

const restricted = (req, res, next) => {
    if(req.session && req.session.username){
        next();
    }
    else{
        (err) => {
            res.status(401).json({Error: err.message});
        }
    }
}

//global middleware
server.use(express.json());
server.use(cors());
server.use(session(sessionOptions));
server.use('/api/vip', restricted, restrictedRouter);
server.use('/api', unrestrictedRouter)



let port = process.env.PORT || 5000;

server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});