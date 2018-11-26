const validateUser = (req, res, next) => {
  console.log('req.session', req.session)
  if (!req.session.username) {
    return res
      .status(401)
      .json({ message: 'user must login to access resource' })
  }
  next()
}

module.exports = validateUser
