const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");

const User = require("./UserModel");
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

function restricted(req, res, next){
    if(req.session && req.session.username){
        next();
    }
    else{
        (err) => {
            res.status(401).json({Error: err.message});
        }
    }
}

server.use(express.json());
server.use(cors());
server.use(session(sessionOptions)); //global middleware


server.get('/', (req, res) => {
    console.log(req.session);
    if(req.session && req.session.username) {
        res.status(200).json({message: `welcome back ${req.session.username}`});
    }
    else {
        res.status(401).json({message: "Login to enter"})
    }});

server.get('/api/users', restricted, (req, res) => {
    User.find()
        .then(user => {
            res.status(200).json({users: user});
        })
        .catch(err => {
            res.status(500).json({error:err.message, message:"You shall not pass!"})
        })

})
server.post("/api/register", (req, res) => {
    User.create(req.body)
        .then(user => {
            res.status(201).json(user);
        })
        .catch(err => {
            res.status(500).json(err.message);
        });
});

server.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    User.findOne({ username })
        .then(user => {
            if(!user) {
                res.status(404).json(`${username} not found`)
            }

            else {
                user
                    .passwordValidation(password)
                    .then(passwordsMatch => {
                        if (passwordsMatch){
                            req.session.username = user.username;  
                            res.status(200).json({Success: "Log-in successful"});
                        } else{
                            res.status(401).json({Error: "invalid password"});
                        }
                    })
                    .catch(err => {
                        res.status(500).json({Error: err.message});
                    });
            }
        })
});

server.get("/api/logout", (req, res) => {
    if(req.session){
        req.session.destroy(err => {
            if(err){
                res.status(500).json(`error logging out`);
            } else {
                res.status(200).json(`Goodbye!!`)
            }
        });
    }
});

let port = process.env.PORT || 5000;

server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});