const express = require("express");
require("dotenv").config();
const helmet = require("helmet");
const cors = require("cors");
//insert bcrypt onboard
const bcrypt = require('bcryptjs');
const session = require('express-session');
//const sessionStore = require('connect-session-knex')(express);
//pull in users model
const Users = require('../users/users-model.js');


const usersRouter = require("../users/users-router");

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session({
    name:'mmmcookies',
    secret:process.env.secret,
}))
server.post('/api/register', async (req, res)=>{
    try{
        const { username, password } = req.body
        const hash = bcrypt.hashSync(password, 10)
        const user = { username, password:hash, role: 2}
        const addedUser = await Users.add(user)
        res.json(addedUser)
    }
    catch (err){
        res.status(500).json({ message: err.message})
    }
})
server.post('/api/login', async (req, res) =>{
    try{
        const [user] = await Users.findBy({username: req.body.username})
        if( user && bcrypt.compareSync(req.body.password, user.password)){
            req.session.user=user;
            res.json({ message: `weclome back, ${user.username}`})
        } else{
            res.status(401).json({message:'bad credentials'})
        }
    }
    catch (err) {
        res.status(500).json({message: err.message})
    }
})

server.use("/api/users", usersRouter);

module.exports = server;