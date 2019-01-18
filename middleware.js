// Check for authorized user

module.exports.protect = (req, res, next) => {
  if( req.session && req.session.userId ) {
    next();
  } else {
    res.status(201).send("Unauthorized.");
  }
}