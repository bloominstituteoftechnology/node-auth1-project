module.exports = (req, res, next) => {
  //check if we remember the client, see if they're already logged in
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({ msg: "access denied" });
  }
};
