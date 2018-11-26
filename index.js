const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const db = require('./data/dbConfig.js');

const server = express();
server.use(express.json());
server.use(cors());

const port = 9000;
const rounds = 14;

server.get("/", (req, res) => {
    res.send('Connected!');
});

server.post("/api/register", (req, res) => {
    const creds = req.body;
    const hash = bcrypt.hashSync(creds.password, rounds);
    creds.password = hash;

    db("users")
        .insert(creds)
        .then(ids => {
            res.status(201).json(ids);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
});

server.post("/api/login", (req, res) => {
    const creds = req.body;

    db("users")
        .where({ username: creds.username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(creds.password, user.password)) {
                // Start session, cookie
            } else {
                res.status(401).json({ message: "You shall not pass!" });
            }
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
});

server.listen(port, () => console.log(`Server live on port ${port}`));