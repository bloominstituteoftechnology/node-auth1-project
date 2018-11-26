const express = require('express');
const helmet = require('helmet');
const knex = require("knex");
const bcrypt = require("bcryptjs");
const knexConfig = require("./knexfile");

const db = knex(knexConfig.development)

const server = express();

server.use(express.json());
server.use(helmet());

server.post("/api/register", (req, res) => {
    const creds = req.body;
    const hash = bcrypt.hashSync(creds.password, 8);
    creds.password = hash;
    db("users")
        .insert(creds)
        .then(ids => res.status(201).json(ids))
        .catch(err => json(err))
})

server.get("/", (req, res) => {
    res.status(200).json({api: "running"});
})

server.get("/api/users", (req, res) => {
    db("users")
        .select("id", "username", "password")
        .then(users => res.status(200).json(users))
        .catch(err => res.status(400).json(err))
})

const port = 9001;

server.listen(port, function() {
    console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});