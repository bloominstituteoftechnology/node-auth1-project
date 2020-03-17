const express = require("express")
const router = express()
const signupRouter = require("./signup/signup-router")
const signinRouter = require("./sign-in/sign-in-router")
const helmet = require("helmet")
const dbConfig = require('./database/dbConfig')
const session = require("express-session")
const KnexConnectionStore = require("connect-session-knex")(session)

router.use(express.json())
router.use(helmet())
router.use(
    session({
        name: "session_name",
        secret: "Hi this is my secret message",
        cookie: {
            maxAge: 1000 * 50 * 10,
            secure: true,
        },
        httpOnly: true,
        resave: false,
        saveUninitialized: false,
        store: new KnexConnectionStore({
            knex: dbConfig,
            createtable: true
        })
    }))
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