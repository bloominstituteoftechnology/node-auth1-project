require('dotenv').config()

module.exports = {
  name: 'tacos',
  secret: process.env.SECRET,
  httpOnly: true,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 1000,
    secure: false
  }
}
