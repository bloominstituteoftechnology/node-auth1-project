const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const server = express();
const User = require('./users/userModel')

mongoose.connect('mongodb://localhost/user')
        .then(() => {
            console.log('connected to database')
        })
        .catch(err => {
            console.log('database connection failed')
        })

server.use(express.json())

server.get('/', (req, res) => {
    res.json({api: 'running'})
})




server.listen(5000, () => {
    console.log('api running on port 5000')
})