const helmet=require('helmet');
const bcrypt=require('bcryptjs');
const morgan=require('morgan');
const express=require('express');

const server=express();
const knex=require('knex');
const knexConfig=require('knexfile.js');
const db=knex(knexConfig.development);

server.use(express.json()).use(helmet()).use(morgan('dev')).use(bcrypt()).use(cors());

server.post('api/register',(req,res)=>{
    const creds=req.body;
    const hash=bcrypt.hashSync(creds.password,3)
    creds.password=hash;
    db('users')
        .insert(creds)
        .then(ids=>res.status(201).json(ids[0]))
        .catch(err=>res.status(500).send(err));
})
server.post('api/login',(req,res)=>{
    const creds=req.body;
    db('users')
        .where({username:creds.username})
        .first()
        .then(user=>{
            user && bcrypt.compareSync(creds.password,user.password)? 
                res.status(200).send('Hello there!'):
                res.status(401).send('You shall not pass')
        })
        .catch(err=>res.status(500).json(err));
})