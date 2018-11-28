const validateUser = (req, res, next) => {
  if (req.session && req.session.username) {
    next()
  } else {
    res.status(401).json({ message: 'user must login to access resource' })
  }
}

module.exports = validateUser
