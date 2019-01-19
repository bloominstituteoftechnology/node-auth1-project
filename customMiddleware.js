const protect = (req, res, next) => {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.status(400).send("You shall not pass!");
  }
};

const auth = (req, res,next) => {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.status(400).send("Restricted!");
  }
}

module.exports = {
  protect: protect,
  auth: auth
}