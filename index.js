const express = require("express")

const session = require("express-session")
const KnexSessionStore = require("connect-session-knex")(session)
const db = ("./database/config")
const userRouter = require("./user/user-routez")
const server = express()

server.use(express.json())
const port = process.env.PORT || 5000
server.use(session({
    resave:false ,
    saveUninitialized: false,
    secert: "hoyoda",
    store: new KnexSessionStore({
        knex: db,
        createtable: true,
    })
}))
server.use(userRouter)



server.use("/", (req,res)=>{
    res.json({
        message: "welcome"
    })
})
server.use((err, req, res, next) => {
	console.log(err)
	
	res.status(500).json({
		message: "Something went wrong",
	})
})

server.listen(port, () => {
	console.log(`Running at http://localhost:${port}`)
})