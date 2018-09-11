'use strict'

exports.convertUsernameToLowecase = (req, res, next) => {
    req.body.username = req.body.username.toLowerCase()
    next()
}

exports.protectedL = (req, res, next) => {
    console.log('askks')
    console.log(req.session)
    if (req.session && req.session.username) {
      next();
    } else {
      res.status(401).json({ message: 'you shall not pass!!' });
    }
  }