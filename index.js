const express = require("express")
const app = express()
const signupRouter = require("./sign-up/sign-up-router")
const signinRouter = require("./sign-in/sign-in-router")

app.use(express.json())
app.use('/signup', signupRouter)
app.use("/signin", signinRouter)

app.get('/', (req, res, next) => {
    res.json({
        message: "Hello there!"
    })
})

const PORT = 8000
app.listen(PORT, () => {
    console.log(`Server is listening on port:${PORT}`)
})