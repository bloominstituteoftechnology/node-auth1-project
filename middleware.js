//check if there's a session with a name
function protected(req, res, next) {
  if (req.session && req.session.name) {
    next();
  }else{
    res.status(401).json({ message: 'You shall not pass!' });
  }
}

module.exports = { protected };
