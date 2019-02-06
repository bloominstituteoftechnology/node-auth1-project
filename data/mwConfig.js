const express = require('express')
const helmet= require('helmet')
const logger = require('morgan')
const cors = require('cors')
const session = require('express-session')

module.exports = server => {
    server.use(express.json(),logger('tiny'), helmet(), cors())
    server.use(
        session({
          name: 'notsession', // default is connect.sid
          secret: 'nobody tosses a dwarf!',
          cookie: {
            maxAge: 1 * 24 * 60 * 60 * 1000,
            secure: false // only set cookies over https. Server will not send back a cookie over http.
          }, // 1 day in milliseconds
          httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
          resave: false,
          saveUninitialized: true
        })
      )

}