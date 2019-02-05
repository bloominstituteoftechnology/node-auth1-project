const express = require("express") ;
const helmet = require('helmet') ;
const logger = require('morgan') ;
const session = require("express-session") ;
const knex = require('knex') ;
const bcrypt = require("bcryptjs") ;
const config = require('./knexfile') ;
const DB = knex(config.development)
// const loginRouter = require('./data/routes/loginRoute') ;
// const registerRouter = require('./data/routes/registerRoute') ; 
const port = process.env.port || 3254 ;
const server = express() ;

const sessionConfig = session({
 name: 'gensym',
 secret: "O'Doyle rules!",
 cookie: {
  maxAge: 1 * 24 * 60 * 60 * 1000,
  secure: true,
 },
 httpOnly: true,
 resave: false,
 saveUninitialized: false
})
server.use(
 helmet(),
 logger('dev'),
 express.json(),
 sessionConfig
) ;

server.get('/api/register', (req, res) => {
 res.send("Ur here.")
})

server.post('/api/login', (req, res) => {
 const reqUser = req.body
 DB('users')
   .where('username', reqUser.username)
   .then((users) => {
    if (users.length && bcrypt.compareSync(reqUser.password, users[0].password)) {
     res
      .json({info: "You're in."})
    }
    else {
     res.
      json({error: "Invalid username or password."})
    }
   })
   .catch(() => {
    res	
     .status(500)
     .json({error: "Error logging in."})
   })
})

server.post('/api/register', (req, res) => {
 const user = req.body ;
 user.password = bcrypt.hashSync(user.password, 8)
 DB('users')
   .insert(user)
   .then((ids) => {
    res
     .status(201)
     .json({id: ids[0]})
    })
   .catch(() => {
    res
     .status(500)
     .json({error: "There was an error."})
   })
})




server.listen(port, () => {
 console.log(`Server is running live on ${port}`)
}) ;