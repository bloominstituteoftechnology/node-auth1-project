const express = require("express")
const router = express()
const signupRouter = require("./signup/signup-router")
const signinRouter = require("./sign-in/sign-in-router")

router.use(express.json())
router.use('/signup', signupRouter)
router.use("/signin", signinRouter)

router.get('/', (req, res, next) => {
    res.json({
        message: "It's alive!"
    })
})

const PORT = 3000
router.listen(PORT, () => {
    console.log(`Server is listening on port:${PORT}`)
}) 