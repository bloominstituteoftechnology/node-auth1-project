const bcrypt = require("bcryptjs");
const router = require("express").Router()

const authRouter = require("../auth/auth-router");
const userRouter = require("../users/users-router")

router.use("/auth", authRouter)

module.exports = router;

