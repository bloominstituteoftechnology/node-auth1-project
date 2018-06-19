const express = require("express");
const User = require("./UserModel");
const router = express.Router();



const get = (req, res) => {
    console.log(req.session);
    if(req.session && req.session.username) {
        res.status(200).json({message: `welcome back ${req.session.username}`});
    }
    else {
        res.status(401).json({message: "Login to enter"})
    }};

const getUsers = (req, res) => {
    User.find()
        .then(user => {
            res.status(200).json({users: user});
        })
        .catch(err => {
            res.status(500).json({error:err.message, message:"You shall not pass!"})
        })

};

const post = (req, res) => {
    const { username, password } = req.body;
    const newUser = new User({username, password});

    newUser
        .save()
        .then(user => {
            res.status(201).json({user});
        })
        .catch(err => {
            res.status(500).json({Error: err.message});
        });
};

router

    .route("/")
        .get(get)
        .post(post);
router
    .route("/users")
        .get(getUsers);



module.exports = router;
