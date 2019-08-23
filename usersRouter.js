const express = require("express");

const bcrypt = require("bcryptjs");

const db = require("./data/dbConfig.js");
const Users = require("./usersModel.js");

const server = express();

server.use(express.json());

server.get("/", (req, res) => {
    res.send("Hey!");
});

server.post("/register", (req, res) => {
    let user = req.body;
    if (user.username && user.password) {
        const hash = bcrypt.hashSync(user.password, 10);
        user.password = hash;
        Users.add(user)
            .then(saved => {
                res.status(201).json(saved);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
    } else {
        res.status(400).json({
            err: "Please provide username and password."
        });
    }
});

server.post("/login", (req, res) => {
    let { username, password } = req.body;
    Users.findBy({ username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                res.status(200).json({ message: `Welcome ${user.username}!` });
            } else {
                res.status(401).json({ message: "Invalid Credentials" });
            }
        });
});

function authenticate(req, res, next) {
    const { username, password } = req.headers;

    if (username && password) {
        Users.findBy({ username })
            .first()
            .then(user => {
                if (user && bcrypt.compareSync(password, user.password)) {
                    next();
                } else {
                    res.status(401).json({ message: "Invalid Credentials" });
                }
            })
            .catch(err => {
                res.status(500).json({ message: "Server Error" });
            });
    } else {
        res.status(400).json({ message: "No Credentials Provided" });
    }
}

server.get("/users", authenticate, (req, res) => {
    Users.find()
        .then(users => {
            res.json(users);
        })
        .catch(err => res.send(err));
});
module.exports = server;
