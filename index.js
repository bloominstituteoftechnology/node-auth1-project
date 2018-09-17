const express = require('express');
const cors = require("cors");
const bcrypt = require("bcryptjs");
const db = require("./db/dbConfig.js");

const server = express();

server.use(express.json());
server.use(cors());


server.get('/', (req, res) => {
    res.send("hello world");
})


server.post("/api/register", (req, res) => {
    const creds = req.body;

    const hash = bcrypt.hashSync(creds.password, 12);

    creds.password = hash;

    db("users")
        .insert(creds)
        .then(ids => {
            const id = ids[0];
            res.status(201).json(id);
        })
        .catch(err => res.status(500).send(err));
});

server.post('/api/login', (req, res) => {
    const creds = req.body;

    db("users")
        .where({username: creds.username})
        .first()
        .then(user => {
            if(user && bcrypt.compareSync(creds.password, user.password)){
                res.status(200).json(`Welcome ${creds.username}`);
            }else {
                res.status(401).json({message:"You shall not pass! Go Back to the Shadows!"});
            }
        })
        .catch(err => res.status(500).send(err));
});

server.get("/api/users", (req, res) => {
    db("users")
        .select("id", "username", "password")
        .then(users => {
            res.json(users);

        })
        .catch(err => res.send(err));
});

server.listen(8000, () => console.log("API running on 8000"));