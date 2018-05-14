const express = require('express');
const mongoose = require('mongoose');


mongoose.connect("mongodb://localhost/Auth")
.then(connected => {
    console.log('connected to db')
}).catch(err => {
    console.log('error connecting to db')
})


const server = express();



server.get("/", (req, res) => {
    res.send("CONNECTED TO POSTMAN")
})

server.listen(5000, () => console.log('API RUNNING ON PORT 5000'));