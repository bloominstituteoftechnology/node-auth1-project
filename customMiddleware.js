const protect = (req, res, next) => {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.status(400).send("Access Denied");
  }
};

module.exports = {
  protect: protect
}