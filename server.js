const express = require('express');
const mongoose = require('mongoose');
const port = process.env.PORT || 5000;

mongoose.connect('mongodb://localhost/CS10', () => {
    console.log(`*** Connected to the Database ***`);
  })

const server = express()

server.use(express.json())

server.get('/', (req,res) =>{
    res.status(200).json({API: "is up and running"})
})

server.post('/api/register' , (req,res) =>{
    //const {username, password} = req.body

})
server.listen(port, () => {
    console.log(`*** Server up and running on ${port} ***`);
  });