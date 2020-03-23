module.exports = (req, res, next) => {
  // check that we remember the client,
  // that the client logged in already
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({ you: "shall not pass!" });
  }
};
