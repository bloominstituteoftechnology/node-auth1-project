const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet')
const cors = require('cors')

const server = express();

server.use(helmet())
server.use(cors())
server.use(express.json())
const session = require('express-session');

const port = 5555;

const UserRouter = require('./user/UserRouter')


mongoose.connect('mongodb://localhost/userdb', {}, (err) => {
    if(err) {
        console.log("Error connecting to Database");
    }
    else {
        console.log("successfully connected to MongoDB");
    }
}) 
   server.use('/', UserRouter);

 server.get('/', (req, res)=> { 
 res.send('API is running...')
        })

server.listen(port, () => { console.log(`\n***Server running on port ${port}***`)});
