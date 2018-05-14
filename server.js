const mongoose = require('mongoose');
const express = require('express');
const User = require('./newUser');

const server = express();

server.use(express.json());

mongoose
  .connect('mongodb://localhost/AuthDB')
  .then(connect => console.log("\n connected to AuthDB"))
  .catch(err => console.log("error connecting to AuthDB", err))

function authenticate(req, res, next) {
    if(req.body.password === 'bananas') {
        next()
    } else {
        res.status(401).send('Incorrect information. Try again')
    }
}

server.get('/', (req, res) => {
  res.send({ msg: 'Test is successful. GET works' })
})

server.post("/api/register", (req, res) => {
    const userInput = req.body;
    const user = new User(userInput);
    user
    .save()
    .then(user => res.status(201).json(user))
    .catch(err => res.status(500).json(err))
})
  




const port = 6060;
server.listen(port, () => { console.log(`Server is running on ${port}`); 
})