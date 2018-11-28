const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session')
const sessionConfig = require('./data/sessionConfig.js')(session)
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
server.use(cors())
server.use(helmet())
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