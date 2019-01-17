const express = require('express');
const knex = require('knex');
const knexConfig = require('./knexfile.js');
const db = knex(knexConfig.development);
const bcrypt = require("bcryptjs");

const server = express();

server.use(express.json());

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
                        res.status(200).json({ message: "Logged In Successfully" });
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

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});