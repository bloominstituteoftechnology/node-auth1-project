require('dotenv').config()

module.exports = {
  name: 'tacos', //* no one will look for my tacos key
  secret: process.env.SECRET,
  httpOnly: true,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60 * 1000,
    secure: false
  }
}
