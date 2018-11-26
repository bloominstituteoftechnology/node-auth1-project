module.exports = (err, req, res, next) => {
  res.status(403).json({ message: err.message })
}
