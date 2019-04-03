module.exports = (req, res, next) => {
  try {
    // if this throws, please don't crash my app
    if (req && req.session && req.session.user) {
      next();
    } else {
      res.status(401).json({ message: "Invalid Credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Ouch, now it's broken" });
  }
};

//old functions used in server CRUD when no routers--------------------------------------------------------------------
//ONLY function for GET users
// function only(username) {
//     return function(req, res, next) {
//       if (req.headers.username === username) {
//         next();
//       } else {
//         res.status(403).json({ message: `you are not ${username}` });
//       }
//     };
//   }
//   //RESTRICTED function for GET users
//   function restricted(req, res, next) {
//     const { username, password } = req.headers;

//     if (username && password) {
//       Users.findBy({ username })
//         .first()
//         .then(user => {
//           // check tha password guess against the database
//           if (user && bcrypt.compareSync(password, user.password)) {
//             next();
//           } else {
//             res.status(401).json({ message: "You shall not pass!!" });
//           }
//         })
//         .catch(error => {
//           res.status(500).json(error);
//         });
//     } else {
//       res.status(401).json({ message: "Please provide credentials" });
//     }
//   }
