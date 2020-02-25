module.exports = (req, res, next) => {
  if (req.session && req.session.loggedIn) {
    next();
  } else {
    res.status(401).json({ you: "cannot pass!" });
  }
};

// module.exports = (req, res, next) => {
//   // let { username, password } = req.headers;
//   if (req.session && req.session.user) {
//     // Users.findBy({ username })
//     //   .first()
//     //   .then(user => {
//     //     if (user && bcrypt.compareSync(password, user.password)) {
//     next();
//     //     } else {
//     //       res.status(401).json({ message: "Invalid Credentials" });
//     //     }
//     //   })
//     //   .catch(({ name, message, stack }) => {
//     //     res.status(500).json({ name, message, stack });
//     //   });
//   } else {
//     res.status(401).json({ error: "You shall not pass!" });
//   }
// };
