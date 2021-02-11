module.exports = {
  restrictedUsers,
};

/// input this into the LIST OF USERS, if logged in, then show users,
//ELSE don't show the users
function restrictedUsers() {
  return (req, res, next) => {
    console.log(req.session, "req session in middleware");
    if (req.session && req.session.user) {
      next();
    } else {
      res
        .status(403)
        .json({ error: "you shall not pass, please validate login now " });
    }
  };
}
