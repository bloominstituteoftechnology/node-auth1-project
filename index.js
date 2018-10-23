const express = require('express');
const helmet = require('helmet');
const knex = require('knex');
const server = express();
const knexConfig = require('./knexfile.js');
const db = knex(knexConfig.development);
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session');

server.use(
  session({
    name:'notsession',
    secret:'john doe',
    cookie:{maxAge:1*24*60*60*1000
    secure:false,
    },//1 day
    httpOnly:true

    resave:false,
    saveUninitialized:false,
  })
);


server.use(cors());
server.use(helmet());
server.use(express.json());

function protected(req,res,next){
  return function(protected){
db('users').select('username')
.then(username=>{
  if(username===req.session.username){
    next();

  } else{
    return res.status(401).json({error: 'Incorrect Credentials'})
  }
});
.catch(err=>{
  res.send(err)
})
}





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
//  req.session.username = user.username
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

server.post('/login', (req,res)=>{
  const credentials = req.body;
  db('users').where({username: credentials.username}).first()
  .then(users => {
    if (users&&bcrypt.compareSync(credentials.password, users.password)){
  req.session.username = users.username
      res.status(200).json({welcome: users.username})
    } else {
      res.status(401).json({
        message:'you shall not pass'
      })
    }
  })
.catch(err=>{
  res.send(err)
});

});


const port=3500;
server.listen(port,()=> {
  console.log(`\n===Api Active On ${port}===\n`)
  }
);
