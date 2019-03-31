const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcrypt');
const session = require('express-session');
const KnexSessionStore = require("connect-session-knex")(session);

const db = require('./data/dbConfig.js');
const Users = require('./users/users-model.js');

const server = express();

const sessionOptions ={
name: 'webauth1challenge', //name 
secret: 'this is a secret',//password
cookie: {
  maxAge: 1000*60*60,
  secure: false
  },
  httpOnly:true,
  resave:false,
  saveUninitialized: false, // ask to save the cookie
  store:new KnexSessionStore({
    knex: require('./data/dbConfig.js') ,
    tablename: 'sessons',
    sidfieldname: "sid",
    createtable:true,
    clearInterval: 1000 *60 * 60
  })
}

server.use(session(sessionOptions)) //initiation of the session
server.use(helmet());
server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
  res.send("It's alive!");
});

//Add POST user and password with hash password

server.post('/api/register', (req, res) =>{
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10)
  user.password = hash;
  Users.add(user)
  .then(saved => {
    res.status(201).json(saved);
  })
  .catch(err => {
    res.status(500).json({err: 'Something went wrong!'})
  });

});

//Add POST login  function 

server.post('/api/login', (req, res)=>{

  console.log(req.session)


  let {username, password } = req.body;
  Users.findBy({username})
  .first()
  .then(user => {
    if (user && bcrypt.compareSync(password, user.password)){

      req.session.user = user //that what we add for session

      res.status(200).json({ message: `${user.username} is logged in and has a cookie!` });
    }else{
      res.status(401).json({ message: 'You shall not pass!' });
    }
  })
.catch(err=>{
  res.status(500).json({err: 'You shall not pass!'})
})
});

//Middleware 

function restricted(req, res, next){ 
  if(req.session && req.session.user){
      next()
  }else{
    res.status(401).json({message: 'You shall not pass!'})
  }
};
  
  //GET option
  server.get('/api/users', restricted, (req, res) => {

    Users
      .find()
      .then(users => {
        res.json(users);
      })
      .catch(err => res.send(err));
  });

  server.get('/api/logout', (req, res) => {
    if(req.session){
      req.session.destroy( err =>{
        if(err) {
          res.send('you can never leave')
        }else{
          res.send('Bey, bey!')
        }
      })
    }else{
      res.end()
    }
    })


const port = process.env.PORT || 8080;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));