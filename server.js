const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session')
const sessionConfig = require('./data/sessionConfig.js')
const morgan = require('morgan')

// Route Files
const userRoutes = require('./routes/userRoutes.js')
const registerRoutes = require('./routes/registerRoutes.js')
const loginRoutes = require('./routes/loginRoutes')
const logoutRoute = require('./routes/logoutRoute')


// initialize server
const server = express();

//Middleware
server.use(express.json());
server.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
  });
server.use(session(sessionConfig))
server.use(morgan('dev'))


//Endpoints
server.use('/api/users', userRoutes)
server.use('/api/register', registerRoutes)
server.use('/api/login', loginRoutes)
server.use('/api/logout', logoutRoute)

//Sanity Check
server.get('/', (req, res) => {
    res.json({message: 'its alive'})
})


module.exports = server