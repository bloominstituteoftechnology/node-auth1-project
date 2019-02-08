// Requirements.

const express = require("express") ;
const helmet = require('helmet') ;
const logger = require('morgan') ;
const session = require("express-session") ;
const knex = require('knex') ;
const KnexSessionStore = require('connect-session-knex')(session)

const bcrypt = require("bcryptjs") ;
const config = require('./knexfile') ;
const loginRouter = require('./data/routes/loginRoute') ;
const registerRouter = require('./data/routes/registerRoute') ; 

// Boilerplate/Setup.
const DB = knex(config.development)
const port = process.env.port || 3254 ;
const server = express() ;
const sessionConfig = {
 name: 'gensym',
 secret: "megalomaniacal scientifically quantifiable viable style.",
 cookie: {
  maxAge:  1 * 24 * 60 * 60 * 1000,
  secure: false,
 },
 httpOnly: true,
 resave: false,
 saveUninitialized: false,
 store: new KnexSessionStore({
  tablename: "sessions",
  sidfieldname: "sid",
  knex: DB,
  createtable: true,
  clearinterval: 1000 * 60 * 5
 })
}
server.use(
 helmet(),
 logger('dev'),
 express.json(),
 session(sessionConfig)
) ;

const gatekeeper = (req, res, next) => {
 if (req.session.id) {
 next()
 }
 else {
 res
  .status(401)
  .json({message: "Not authenticated."})
 }
}
// Endpoints.

server.get('/api/users', gatekeeper, async (req, res) => {
 const users = await DB('users')
 res
  .json(users)
})

server.get('/api/logout', (req, res) => {
 if (req.session) {
  req.session.destroy()
 }
 else {
  res
   .json({message: 'You are logged out.'})
 }
})

server.post('/api/login', (req, res) => {
 const reqUser = req.body
 console.log("login user pw:", reqUser.password)
 DB('users')
   .where('username', reqUser.username)
   .then((users) => {
    if (users.length && bcrypt.compareSync(reqUser.password, users[0].password)) {
     req.session.id = reqUser.id ;
     res.json({info: `You're in.`, cookie: req.session.cookie})
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
 console.log("register user pw:", user.password)
 user.password = bcrypt.hashSync(user.password, 8)
 console.log
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
}) 