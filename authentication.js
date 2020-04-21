module.exports = (req, res, next) => {
    console.log("notsession", req.session);
    console.log(req.session.loggedIn)
    if (req.session.loggedIn) {
      next();
    } else {
      res.status(401).json({ message: "You cannot pass!!" });
    }
  };