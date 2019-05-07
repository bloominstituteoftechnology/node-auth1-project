const router = require("express").Router();
const Auth = require("./auth-model");
const bcrypt = require("bcryptjs");

router.post("/register", (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 8);

  user.password = hash;

  Auth.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.post("/login", (req, res) => {
  let { username, password } = req.body;

  Auth.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.username = user.username; // added
        res.status(200).json({ mess: `welcome ${user.username}` });
      } else {
        res.status(401).json({ mess: " invalid creds" });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

// added
router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.send("error logging you out");
      } else {
        res.send("bye");
      }
    });
  } else {
    res.end();
  }
});
module.exports = router;
