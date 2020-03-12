const express = require('express');
const server = express();
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session')

const sessionConfig ={
    name: 'Dottoe',//if left blank name will be sid. This is a security risk.
    secret: "Kleeg was here.",//Good idea to save this in an ENV variable.
    cookie:  {
        maxAge: 1000 * 10,
        secure: false,//Should be true in Production
        httpOnly: true, //cookie cannot be accessed by the client
    },
    resave: false,
    saveUninitialized: false,//Research needed. GDPR compliance about setting cookies automatically.
}

server.use(cors());
server.use(helmet());
server.use(express.json());
server.use(session(sessionConfig))

server.get('/', (req,res) => {
    res.send('<p>Hello from the API</p>')
})
server.use((err, req, res, next) => {
    console.log(err)
    res.status(500).json({
        message: "Something went wrong."
    })
})

module.exports = server;