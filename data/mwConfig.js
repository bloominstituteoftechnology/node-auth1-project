const express = require('express')
const helmet= require('helmet')
const logger = require('morgan')
// const cors = require('cors')
const session = require('express-session')

const sessionConfig = {
    name: 'notsession', // default is connect.sid, change it to something else
    secret: 'nobody tosses a dwarf!',
    cookie: {
      maxAge:  1000 * 15,// 1 day in milliseconds 1 * 24 * 60 * 60 * 1000
      secure:  false //set to true during production, false during development // only set cookies over https. Server will not send back a cookie over http.
    }, 
    httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
    resave: false, //for compliance with US law
    saveUninitialized: true 
  }

module.exports = server => {
    server.use(express.json(),logger('tiny'), helmet()) //cors(),
    server.use(session(sessionConfig))
}