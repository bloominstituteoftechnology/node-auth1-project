const router = require("express").Router();
const bcrypt = require("bcrypt");

const User = require("../users/users-model");

const {
  checkPasswordLength,
  checkUsernameExists,
  checkUsernameFree,
} = require("./auth-middleware");

router.post(
  "/register",
  checkPasswordLength,
  checkUsernameFree,
  (req, res, next) => {
    const { username, password } = req.body;
    const passwordHash = bcrypt.hashSync(password, 8);
    User.add({ username, password: passwordHash })
      .then((saved) => res.status(201).json(saved))
      .catch(next);
  }
);

router.post("/login", checkUsernameExists, (req, res, next) => {
  const { password } = req.body;
  if (bcrypt.compareSync(password, req.user.password)) {
    req.session.user = req.user;
    res.json({ message: `Welcome ${req.user.username}` });
  } else {
    next({ status: 401, message: "Invalid credentials" });
  }
});

router.get("/logout", (req, res, next) => {
  if (req.session.user) {
    req.session.destroy((err) => {
      if (err) {
        next(err);
      } else {
        res.status(200).json({ message: "logged out" });
      }
    });
  } else {
    res.status(200).json({ message: "no session" });
  }
});

// eslint-disable-next-line
router.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
    cusomeMessage: "Something went wrong inside the auth router",
  });
});

module.exports = router;
