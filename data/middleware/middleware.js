const session = require('express-session')

const sessionConfig = {
  name: 'cookie',
  secret: 'slkjdnvwireufnlse89r3qghpq39erhq[weif',
  cookie: {
    maxAge: 1000 * 60 * 5,
    secure: false, // should be true in production
  },
  httpOnly: true,
  resave: false,
  saveUninitialized: false,
} 

module.exports = {
  useSession: session(sessionConfig)
}