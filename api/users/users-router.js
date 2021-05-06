const express = require("express")
const { restricted } = require("../auth/auth-middleware")
const { find } = require("./users-model")

const router = express.Router()

router.get("/api/users"), restricted(), async (req, res, next) => {
  try {
    res.status(200).json(await find())
  } catch(err) {
      next(err)
  }
}

module.exports = router