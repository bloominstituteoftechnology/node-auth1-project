const express = require('express');
const knex = require('knex');
const knexConfig = require('./knexfile.js');
const db = knex(knexConfig.development);
const bcrypt = require("bcryptjs");
const session = require("express-session");

const server = express();

server.use(express.json());

server.use(
    session({
        name: "newsession",
        secret: "original secret do not steal",
        cookie: {
            maxAge: 1 * 24 * 60 * 60 * 1000,
            secure: true,
        },
        httpOnly: true,
        resave: false,
        saveUninitialized: false,
    })
);

server.post("/api/register", (req, res) => {
    if (req.body.username && req.body.password && typeof req.body.username === "string" && typeof req.body.password === "string") {
        let user = req.body;
        user.password = bcrypt.hashSync(user.password);
        db("users")
            .insert(user)
            .then(ids => {
                res.status(201).json(ids[0]);
            }).catch(error => {
                res.status(500).json({message: "Error registering user", error: error});
            });
    } else {
        res.status(400).json({ error: "Incorrectly formatted user data" });
    }
});

server.post("/api/login", (req, res) => {
    if (req.body.username && req.body.password && typeof req.body.username === "string" && typeof req.body.password === "string") {
        let user = req.body;
        db("users")
            .where("username", user.username)
            .then(dbUsers => {
                if (dbUsers.length 
                    && bcrypt.compareSync(user.password, dbUsers[0].password)) {
                        req.session.userId = dbUsers[0].id;
                        res.status(200).json({ message: "Logged in successfully", userId: req.session.userId });
                    } else {
                        res.status(422).json({ error: "Incorrect username or password" })
                    }
            }).catch(error => {
                res.status(500).json({message: "Error logging in", error: error});
            });
    } else {
        res.status(400).json({ error: "Incorrectly formatted user data" });
    }
});

server.get("/api/users", (req, res) => {
    if (req.session && req.session.userId) {
        db("users").then(dbUsers => {
            res.status(200).json(dbUsers);
        }).catch(error => {
            res.status(500).json({message: "Error getting users", error: error});
        });
    } else {
        res.status(401).json({message: "You need to be logged in to access this"});
    }
});

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});