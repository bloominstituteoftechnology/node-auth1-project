const express = require('express');

const router = express.Router();

const Users = require("../users/user-model.js")
const bcrypt = require("bcryptjs")

router.post('/register', (req, res) => {
    let username = req.headers.username;
    let password = req.headers.password;
    console.log({username,password})
    if (username && password){
        const hash = bcrypt.hashSync(password, 12);
        password = hash;
        console.log(username, password);
        Users.add({username, password})
            .then(user => res.status(201).json(user))
            .catch(user => res.status(500).json({message: "Unable to save the user"}))
    } else {
        res.status(400).json({message: "Please provide username and password"})
    }
}
)

router.post('/login', (req, res) => {
    
    let username = req.headers.username;
    let password = req.headers.password;
    console.log(username);
    if (username && password){
        
        Users.find(username).first()
            .then(user => {
                console.log(user)
                if (user && bcrypt.compareSync(password, user.password)) {
                    res.status(200).json({message: `welcome ${user.username}`})
                  } else {
                    res.status(401).json({ message: "Invalid Credentials" });
                  }
                }
            )
    } else {
        res.status(400).json({message: "Please provide username and password"})
    }

}
)
    

module.exports = router;