const router = require("express").Router();

const bcrypt = require("bcryptjs");

const Users = require("../users/users-model");

router.post("/register", (req, res) => {
  const userInfo = req.body;
  const ROUNDS = process.env.HASHING_ROUNDS || 8;

  const hash = bcrypt.hashSync(userInfo.password, ROUNDS);

  userInfo.password = hash;

  Users.add(userInfo)
    .then((users) => {
      res.json(users);
    })
    .catch((err) => res.send(err));
});
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  Users.findBy({ username })
    .then(([user]) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.user = {
          id: user.id,
          username: user.username,
        };
        res.status(200).json({ msg: `welcome ${user.username}` });
      } else {
        res.status(401).json({ msg: "invalid credentials" });
      }
    })
    .catch((err) => {
      res.status(500).json({ msg: "error finding user", err });
    });
});

router.get("/logout", (req, res) => {
  if (req.session) {
    if (req.session) {
      req.session.destroy(/* error=>{error? pass:error}*/);
    } else {
      res.status(200).json({ msg: "already logged" });
    }
  }
});

module.exports = router;
