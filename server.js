const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');

const server = express();

// add routes here 
//const userRouter = require('./users/userRouter.js');

server.use(helmet());
server.use(cors());
server.use(express.json());

server.get('/', (req, res) => res.send('API Running...'))

//connect mongoose here
mongoose.connect('mongodb://localhost/users', {userMongoClient: true}, (error) => {
    if(error) console.log(error);
    console.log('\n*** Connected to database ***\n');
})

const port = 5555;
server.listen(port, () => {
    console.log(`Server up and running on ${port}` )
})