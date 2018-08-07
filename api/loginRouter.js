const codes = require("../data/statusCodes");

const express = require("express");
const bcrypt = require("bcryptjs");
const session = require('express-session');

const db = require("../data/dbConfig");

const router = express.Router();

router.post("/", (req, res, next) => {
    const user = req.body;
    if(!user.username) {
        throw { code: codes.BAD_REQUEST, message: "Username has not been entered please enter one"}
    }
    if(!user.password) {
        throw { code: codes.BAD_REQUEST, message: "Password has not been entered please enter one"}
    }
    db("users")
    .where("users.username", "=", req.body.username)
    .first()
    .then(response => {
        const rightPassword = bcrypt.compareSync(user.password, response.password)
        if(!response || !rightPassword) {
            res.status(codes.BAD_REQUEST).json("You shall not pass! evildoer");
        }
        else {
        req.session.username = user.username;
        res.status(codes.OK).json(`${req.session.username} has logged in`);
        }
    });
});
module.exports = router;

//sqlizer