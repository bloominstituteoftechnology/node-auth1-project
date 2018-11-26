const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const userRoutes = require('./routes/userRoutes.js')
const registerRoutes = require('./routes/registerRoutes.js')
const loginRoutes = require('./routes/loginRoutes')

// initialize server
const server = express();

//Middleware
server.use(express.json());
server.use(cors());
server.use(helmet());

//Endpoints
server.use('/api/users', userRoutes)
server.use('/api/register', registerRoutes)
server.use('/api/login', loginRoutes)

//Sanity Check
server.get('/', (req, res) => {
    res.json({message: 'its alive'})
})


module.exports = server