const bcrypt = require("bcryptjs");

const router = require("express").Router();

const Users = require("./users-model");

router.post("/register", (req, res) => {
  const userInfo = req.body;

  const ROUNDS = process.env.HASHING_ROUNDS || 8;
  const hash = bcrypt.hashSync(userInfo.password, ROUNDS);

  userInfo.password = hash;

  Users.add(userInfo)
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      res.status(500).json({
        errorMessage: "Ooops! Something went wrong",
      });
    });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  Users.findBy({ username })
    .then(([user]) => {
      console.log("user", user);
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.user = {
          id: user.id,
          username: user.username,
        };

        res.status(200).json({ hello: user.username });
      } else {
        res.status(500).json({ message: "invalid credentials" });
      }
    })
    .catch((error) => {
      res.status(500).json({ errorMessage: "error finding the user" });
    });
});

module.exports = router;
