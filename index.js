const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const server = express()
const port = process.env.PORT || 4300;
const db = require("./database/helpers/userHelpers");

server.use(express.json())
server.use(cors());

server.get("/", (req, res) => {
  res.send("The Sever is alive");
});

server.get('/api/users', (req, res) => {
    db.find()
        .then(users => {
            res.json(users)
        })
        .catch(err => {
            res.send(err)
        })
})


server.post('/api/register', (req, res) => {
    const user = req.body;
    user.password = bcrypt.hashSync(user.password, 16);

    db.insert(user)
        .then(ids => {
            res.status(201).json({ id: ids[0] })
        })
        .catch(err => {
            res.status(500).send(err)
        })
})



server.post('/api/login', (req, res) => {
    //Check if username exists and the passwords match the user
    const bodyUser = req.body

    db.findByUser(bodyUser.username)
        .then(users => {
            if (users.length && bcrypt.compareSync(bodyUser.password, users[0].password))
            {
                res.status(200).json({ info: "correct" })
            }
            else {
                res.status(404).json({ err: "Invalid Username or Password" })
            }
        })
        .catch(err => {
            res.status(500).send(err)
        })



})


server.listen(port, () => {
    console.log(`\n === WebAPI Auth-I Listening on: ${port} === \n`)
})