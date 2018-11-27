const validateUser = (req, res, next) => {
  if (!req.session.username) {
    return res
      .status(401)
      .json({ message: 'user must login to access resource' })
  }
  next()
}

module.exports = validateUser
