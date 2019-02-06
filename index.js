const express = require('express')
const bcrypt = require('bcryptjs')
const mwConfig = require('./data/mwConfig')
const db = require('./data/dbConfig.js')
// const session = require('express-session')

// const sessionConfig = {
//   name: 'notsession', // default is connect.sid, change it to something else
//   secret: 'nobody tosses a dwarf!',
//   cookie: {
//     maxAge: 1 * 15, // 1 day in milliseconds 1 * 24 * 60 * 60 * 1000
//     secure: false //set to true during production, false during development // only set cookies over https. Server will not send back a cookie over http.
//   },
//   httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
//   resave: false, //for compliance with US law
//   saveUninitialized: true
// }

const PORT = 5100
const server = express()
// server.use(express.json())
// server.use(session(sessionConfig))
mwConfig(server)

server.post('/register', (req, res) => {
  const creds = req.body
  const hash = bcrypt.hashSync(creds.password, 14)
  creds.password = hash
  db('users')
    .insert(creds)
    .then(ids => {
      res.status(201).json(ids)
    })
    .catch(() => {
      res.status(500).json({ error: 'Unable to register user.' })
    })
})

server.post('/login', (req, res) => {
  const creds = req.body
  db('users')
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        req.session.userId = user.id
        res.status(200).json({ message: `${user.username} is logged in` })
      } else {
        res.status(401).json({ message: 'You shall not pass!' })
      }
    })
    .catch(() =>
      res.status(500).json({ message: 'Please try logging in again.' })
    )
})

function protected(req, res, next) {
  if (req.session && req.session.userId) {
    next()
  } else {
    res.status(401).json({ message: 'You shall not pass, not authenticated.' })
  }
}

//protect this endpoint so only logged in users can see the data
server.get('/users', protected, (req, res) => { //  add : async -----if uncomment the below code
  // const users = await db('users')
  db('users')
    .select('id', 'username', 'password') //<----NEVER EVER SEND THE PASSWORD BACK TO THE CLIENT, THIS IS WHAT NOT TO DO!!!
    .then(users => {
      res.json(users)
    })
    .catch(() => {
      res.status(500).json({ message: 'You shall not pass!' })
    })
})

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
