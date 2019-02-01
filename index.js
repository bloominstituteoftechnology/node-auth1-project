const express = require("express") ;
const helmet = require('helmet') ;
const logger = require('morgan') ;
const bcrypt = require('bcryptjs') ;
const loginRouter = require('./data/routes/loginRoute') ;
const registerRouter = require('./data/routes/registerRoute') ; 
const port = process.env.port || 3254 ;
const server = express.server() ;

server.use(
 helmet(),
 logger(),
 express.json()
) ;

server.use('/api/register',) ;
server.use('/api/login', ) ;

server.listen(port, () => {
 console.log(`Server is running live on ${port}`)
}) ;