//server module Router extension
const router = require("express").Router();
//password cryptography
const bcrypt = require("bcryptjs");
//database model, to use for authentication
const Users = require("../users/users-model.js");

//CRUD of authentication using '/api/auth'
//POST create user/password
router.post("/register", (req, res) => {
  let user = req.body;
  //hashing method
  const hash = bcrypt.hashSync(user.password, 4);
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

//POST Login
router.post("/login", (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      // check tha password guess against the database
      //comparesync, password goes firs to 'pass' then user.password
      if (user && bcrypt.compareSync(password, user.password)) {
        // req.session is added by express-session
        req.session.user = user;

        res.status(200).json({ message: `Welcome ${user.username}!` });
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

//GET and DESTROY logout
router.get('/logout', (req, res) => {
    if (req.session) {
      req.session.destroy(err => {
        if (err) {
          res.status(500).json({
            message:
              'see ya later',
          });
        } else {
          res.status(200).json({ message: 'logged out' });
        }
      });
    } else {
      res.status(200).json({ message: 'logged out' });
    }
  });

//export router!
module.exports = router;
