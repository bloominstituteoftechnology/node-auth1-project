const bcryptjs = require("bcryptjs");
const router = require("express").Router();
const Users = require("../users/users-model.js");
const usersModel = require("../users/users-model.js");

router.post("/register", (req, res) => {
  // validate the body, to make sure there is a username and password.
  const { username, password } = req.body;
  // hash user passwordjs
  const rounds = process.env.HASH_ROUNDS || 8; // change to a higher number in production
  const hash = bcryptjs.hashSync(password, rounds);
  Users.add({ username, password: hash })
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => res.send(err));
});

router.post("/login", (req, res) => {
  // validate the body, to make sure there is a username and password.
  const { username, password } = req.body;
  // verify user passwordjs
  Users.findBy({ username })
    .then(([user]) => {
      if (user && bcryptjs.compareSync(password, user.password)) {
          req.session.user = { id: user.id, username: user.username }
        res.status(200).json({ welcome: "to moria" });
      } else {
        res.status(401).json({ you: "cannot pass" });
      }
    })
    .catch(err => {
      console.log("error on login", err);
      res.status(500).send(err);
    });
});

router.get('/logout', (req, res) => {
    if(req.session){
        req.session.destroy(error => {
            if(error){
                res.status(500).json({ message: "Could not logout, please try again." })
            } else {
                res.status(204).end();
            }
        });
    } else {
        res.status(204)
    }
});

module.exports = router;