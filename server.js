const express = require('express');
const mongoose = require('mongoose');
const User = require("./Users/User");
const bcrypt = require('bcrypt')



mongoose.connect("mongodb://localhost/Auth")
.then(connected => {
    console.log('connected to db')
}).catch(err => {
    console.log('error connecting to db')
})


const server = express();

function validate(password, passwordDB) {
    bcrypt.compare(password, passwordDB, function(err, res) {
        console.log(res)
    })
}



function seperateObject(info) {
    let usernameVal = Object.values(info, [0]);
    usernameVal = usernameVal[0]
    let obj = {
        username: usernameVal.toString()
    }
    return obj;
}

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

server.post('/login', (req, res, next) => {
    const login = req.body;
    // console.log(login)
    
    User.findOne(seperateObject(login)).then(user => {
        // console.log(login.password)
        // console.log(user.password)

        user.isPasswordValid(login.password).then(valid => {
            if(valid) {
                res.send("Login Successfult")
            } else {
                res.send("login failed")
            }
        })
    }).catch(err => {
        res.status(400).json({
            error: "Could not find that username"
        })
    })
})

server.listen(5000, () => console.log('API RUNNING ON PORT 5000'));

