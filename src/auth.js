const jwt = require('jsonwebtoken')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const JwtStrategy = require('passport-jwt').Strategy
const { ExtractJwt } = require('passport-jwt')
const User = require('./models/user')

const secret = 'squirrel'

const makeToken = (user) => {
  const payload = {
    sub: user._id,
    iat: Date.now()
  }
  const options = {
    expiresIn: '24h'
  }
  return jwt.sign(payload, secret, options)
}

const localStrat = new LocalStrategy((username, password, done) => {
  User.findOne({ username })
    .then(user => {
      if (!user) return done(null, false)
      user.validatePassword(password)
        .then(valid => {
          if (valid) return done(null, user)
          else return done (null, false)
        })
    })
})

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secret,
}
const jwtStrat = new JwtStrategy(jwtOptions, (payload, done) => {
  console.log('here')
  console.log(payload)
  User.findById(payload.sub)
    .then(user => {
      if (user) done(null, user)
      else done(null, false)
    })
    .catch(err => done(err))
})

passport.use(localStrat)
passport.use(jwtStrat)

module.exports = {
  passport,
  makeToken
}