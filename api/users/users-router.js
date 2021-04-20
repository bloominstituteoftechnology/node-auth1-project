// Require the `restricted` middleware from `auth-middleware.js`. You will need it here!
const { Router } = require("express")
const {restricted} = require("../auth/auth-middleware.js")
const router = Router()
const users = require("./users-model.js")

router.get("/", restricted, (req, res, next)=>{
    users.find()
    .then(data=>{
        res.status(200).json(data)
    })
    .catch(next)
})

module.exports = router;