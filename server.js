
  
const express = require('express')
const helmet = require('helmet')
const morgan = require('morgan')
const cors = require('cors')
require('colors')
const bcrypt = require('bcryptjs')
const session = require('express-session')
const sessionStore = require('connect-session-knex')(session)
const Users = require('./users/user-model')
const router = require('./users/user-router.js')

const server = express()
server.use(helmet())
server.use(morgan('dev'))
server.use(cors())
server.use(express.json())

server.use(
    session({
      name: "SKelator",
      secret: "this should come from process.env", 
      cookie: {
        maxAge: 1000 * 60,
        secure: false, 
        httpOnly: true, 
      },
      resave: false, 
      saveUninitialized: false, 
      store: new sessionStore({
        knex: require('./data/config'),
        tablename: 'sessions',
        sidfieldname: 'sid',
        createTable: true,
        clearInterval: 1000 * 60 * 60,
      }),
    })
  )
  

  server.post('/auth/register', async (req, res) => {
    try {
      const { username, password } = req.body

      const hash = bcrypt.hashSync(password, 10)
      const user = { username, password: hash, role: 2 }
      const addUser = await Users.add(user)
 
      res.json(addUser);
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  })
  
  server.post('/auth/login', async (req, res) => {

    try {
      const [user] = await Users.findBy({ username: req.body.username })
      if (user && bcrypt.compareSync(req.body.password, user.password)) {

        req.session.user = user;
        res.json({ message: `welcome back, ${user.username}` })
      } else {

        res.status(401).json({ message: "bad credentials" })
      }
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  })
  
  server.get('/auth/logout', (req, res) => {
    if (req.session && req.session.user) {
      req.session.destroy((err) => {
        if (err) res.json({ message: 'do not pass go'})
        else res.json({ message: 'adios' })
      })
    } else {
      res.json({ message: 'there was no session' })
    }
  });
  
  server.use('/users', router)
  
  server.get('/', (req, res) => {
    res.json({ api: 'working' })
  })
  


server.use('./users', router)


module.exports = server