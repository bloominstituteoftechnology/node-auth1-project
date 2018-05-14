const express = require('express');
const mongoose = require('mongoose');
const User = require("./Users/User")


mongoose.connect("mongodb://localhost/Auth")
.then(connected => {
    console.log('connected to db')
}).catch(err => {
    console.log('error connecting to db')
})


const server = express();

// function validatePassword(req, res, next)  {

// }

server.use(express.json())

server.get("/", (req, res) => {
    res.send("CONNECTED TO POSTMAN")
})

server.post('/register', (req, res) => {
    const user = new User(req.body);

    user.save().then(user => {
        res.send(user)
    }).catch(err => {
        res.send("There was an error registering as a new user")
    })
})

server.post('/login', (req, res) => {
    const login = req.body;
    console.log(login)

    User.findOne(login).then(username => {
        // console.log(`this is the ${username}`)
        res.status(200).json(username);
    }).catch(err => {
        res.status(400).json({
            error: "Could not find that username"
        })
    })
})

server.listen(5000, () => console.log('API RUNNING ON PORT 5000'));