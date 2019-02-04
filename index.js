const express = require("express") ;
const helmet = require('helmet') ;
const logger = require('morgan') ;
const knex = require('knex') ;
const bcrypt = require("bcryptjs") ;
const config = require('./knexfile') ;
const DB = knex(config.development)
// const loginRouter = require('./data/routes/loginRoute') ;
// const registerRouter = require('./data/routes/registerRoute') ; 
const port = process.env.port || 3254 ;
const server = express() ;

server.use(
 helmet(),
 logger('dev'),
 express.json()
) ;

server.get('/api/register', (req, res) => {
 res.send("Ur here.")
})

server.post('/api/login', (req, res) => {
 const user = req.body
 DB('users')
   .where('username', user.username)
   .then((users) => {
    if (users.length && user.password === user[0].password) {
     res
      .json({info: "You're in."})
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
 user.password = bcrypt.hashSync(user.password)
 // req.body = hashedPW ;
 console.log(user.password)
  DB('users')
    .insert(user)
    .then((users) => {
     if (users.length && user.password === users[0].password) {
      console.log(users.password)
      res
       .json({info: "You're in."})
     }
     else {
      res
       .status(404)
       .json({err: "Invalid user or password"})
     }
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