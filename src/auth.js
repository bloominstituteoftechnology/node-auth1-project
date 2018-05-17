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
      if (!user) return done('whoah', false)
      console.log(user)
      console.log(password)
      user.validatePassword(password)
        .then(valid => {
          console.log(valid)
          if (valid) {
            user.set({ token: makeToken(user) })
            user.save()  
              .then(() => done(null, user))
              .catch(err => done(err))
          }
          else return done ('nelly', false)
        })
    })
})

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secret,
  passReqToCallback: true
}
const jwtStrat = new JwtStrategy(jwtOptions, (req, payload, done) => {
  const token = req.headers.authorization.slice(7)
  User.findOne({ token })
    .then(user => {
      if (user) {
        console.log('i: ', token)
        console.log('u: ', user.token)
        done(null, user)
      }   
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