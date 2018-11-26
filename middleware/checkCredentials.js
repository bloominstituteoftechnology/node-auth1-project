const checkCredentials = (req, res, next) => {
  const { username, password } = req.body
  if (!username.trim() || username.length > 20) {
    return next(new Error('username is required (max 20 char)'))
  }
  if (!password.trim() || password.length > 20) {
    return next(new Error('password is required (20 max char)'))
  }

  req.body.username = username.toLowerCase()
  next()
}

module.exports = checkCredentials
