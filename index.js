const express = require("express")
const app = express()
const helmet = require("helmet")
const dbConfig = require("./data/db-config")
const signupRouter = require("./sign-up/sign-up-router")
const signinRouter = require("./sign-in/sign-in-router")
const session = require('express-session')
const KnexConnectionStore = require("connect-session-knex")(session)

app.use(express.json())
app.use(helmet())
app.use(
    session({
        name: "session_name",
        secret: "my name is peter parker",
        cookie: {
            maxAge: 1000 * 60 * 15,
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