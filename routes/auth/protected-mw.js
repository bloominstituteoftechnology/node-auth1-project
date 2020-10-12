module.exports = (req, res, next) => {
  if (req.session.username) {
    next();
  } else {
    res.status(401).json({ Troll: "I will eat you if you try to pass!!" });
  }
};
