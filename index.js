const express = require('express');
const knex = require('knex');
const bcrypt = require('bcryptjs');
const logger = require('morgan');
const Joi = require('joi');

const dbConfig = require('./knexfile');
const db = knex(dbConfig.development);

const loginRouter = require('./routes/loginRoutes');

const PORT = 4444;
const server = express();

server.use(
    express.json(),
    logger('dev')
);
server.use("/api",loginRouter)

// server.post('/api/register', (req, res)=>{
//     const user = req.body;
//     const validateUser =Joi.validate(user, validate.user);
//     if(validateUser.error){
//         res.status(400).json({err:"validation failed"});
//     }else{
//         user.password = bcrypt.hashSync(user.password, 14);
//         console.log(user);
//     db('users').insert(user).then(id=>{
//         res.status(201).json({message:"user added"});
//     })
//     .catch(err=>{
//         res.status(500).json({err: "something has gone wrong adding this user please try again"});
//     });}
// })

server.listen(PORT, ()=> console.log(`server running on port: ${PORT}`));
