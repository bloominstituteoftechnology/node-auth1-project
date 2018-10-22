const express = require('express');
const helmet = require('helmet');
const knex = require('knex');
const server = express();
const knexConfig = require('./knexfile.js');
const db = knex(knexConfig.development);
const cors = require('cors');
const bcrypt = require('bcryptjs');

server
server.use(cors());
server.use(helmet());
server.use(express.json());

server.get('/',(req,res)=>{
  res.send('active')
});

server.post('/register',(req,res) =>{
  const credentials = req.body;

//hash
const hash = bcrypt.hashSync(credentials.password,14);
credentials.password = hash;
db('users').insert(credentials)
.then(ids=>{
  const id = id[0];
  res.status(201).json({newUserId:id})
})
.catch(err=>{
  res.status(500).json(err);
});
});

server.get('/api/users',(req,res)=>{
  db('users')
  .select('id','username', 'password')
  .then(users =>{
    res.json(users);
  })
  .catch(err=>{
    res.send(err);
  })
})


const port=3500;
server.listen(port,()=> {
  console.log(`\n===Api Active On ${port}===\n`)
  }
);
