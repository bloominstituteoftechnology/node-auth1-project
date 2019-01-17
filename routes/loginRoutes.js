const express = require('express');
const db = require('../data/helpers/helpers');
const Joi = require('joi');
const validate = require('../data/helpers/validations');

const router = express.Router();
const bcrypt = require('bcryptjs');

router.post('/register', (req, res) => {
    const user = req.body;
    const validateUser = Joi.validate(user, validate.user);
    if (validateUser.error) {
        res.status(400).json({
            err: "validation failed"
        });
    } else {
        user.password = bcrypt.hashSync(user.password, 14);
        db.addUser(user).then(id => {
                res.status(201).json({
                    message: "user added"
                });
            })
            .catch(err => {
                res.status(500).json({
                    err: "something has gone wrong adding this user please try again"
                });
            });
    }
})

router.post('/login',(req, res)=>{
    const user = req.body;
    db.login(user.username)
        .then(users=>{
            if (users.length && bcrypt.compareSync(user.password, users[0].password)){
                res.json({message: "success"});
            }else{
                res.status(406).json({err: "Invalid Username or Password"});
            }
        })
        .catch(err=>{
            res.status(500).json({error:err})
        })
})

router.post('')

module.exports = router;