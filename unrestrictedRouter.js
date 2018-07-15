const express = require("express");
const User = require("./UserModel");
const router = express.Router();


const post = (req, res) => {
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
};

const get = (req, res) => {
    if(req.session){
        req.session.destroy(err => {
            if(err){
                res.status(500).json(`error logging out`);
            } else {
                res.status(200).json(`Goodbye!!`)
            }
        });
    }
};

const postUser = (req, res) => {
    User.create(req.body)
        .then(user => {
            res.status(201).json(user);
        })
        .catch(err => {
            res.status(500).json(err.message);
        });
};

router
    .route("/login")
        .post(post);
router
    .route("/logout")
        .get(get);

router
    .route("/register")
        .post(postUser);

module.exports = router;