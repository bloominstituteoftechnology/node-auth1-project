const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const User = require("./UserModel");
const server = express();

mongoose.connect("mongodb://localhost:27017/userAuthdb")
    .then(() => {
        console.log('\n*** Connected to database ***\n');
    })
    .catch(err =>{
        console.log(err.message);
    });

server.use(express.json());
server.use(cors());


server.get('/', (req, res) => {
    res.status(200).json({Success: "API is running . . ."});
});

server.get('/api/users', (req, res) => {
    User.find()
        .then(user => {
            res.status(200).json(user);
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
                        passwordsMatch?res.status(200).json({Success: "Log-in successful"}):res.status(401).json({Error: "invalid password"});
                    })
                    .catch(err => {
                        res.status(500).json({Error: err.message});
                    });
            }
        })
})


let port = process.env.PORT || 5000;

server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});