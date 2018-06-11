const express = require('express');
const server = express()
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const port = process.env.PORT || 5000;


//Routes

const registerController = require('./register/registerController')
const userController = require('./users/userController')
const loginController = require('./login/loginController')

//Gobal Middleware

server.use(halmet())
server.use(cors())
server.use(express.json())

//Endpoints

//Mongoose
mongoose.connect('mongodb://localhost/CS10', () => {
    console.log(`*** Connected to the Database ***`);
  })



server.get('/', (req,res) =>{
    res.status(200).json({API: "is up and running"})
})

server.post('/api/register' , (req,res) =>{
    //const {username, password} = req.body

})
server.listen(port, () => {
    console.log(`*** Server up and running on ${port} ***`);
  });