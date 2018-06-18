const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');

const server = express();

const port = 5555;

server.use(helmet());
server.use(cors());
server.use(express.json()); //this needs to be bofore route(line 15) becoz it needs to be json format before passing to the route.

// add route here 
const userRouter = require('./users/userRouter');

server.use('/api', userRouter);

server.get('/', (req, res) => res.send('API Running...'))

//connect mongoose here
mongoose.connect('mongodb://localhost/users', {userMongoClient: true}, (error) => {
    if(error) console.log(error);
    console.log('\n*** Connected to database ***\n');
})


server.listen(port, () => {
    console.log(`Server up and running on ${port}` )
})