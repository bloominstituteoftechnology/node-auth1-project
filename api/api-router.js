const router = require("express").Router();

const authRouter = require("../auth/auth-router");
const usersRouter = require("../users/user-router");

router.use("/auth", authRouter);
router.use("/users", usersRouter);

router.get("/", (req, res) => {
  res.json({ api: "Welcome" });
});

module.exports = router;