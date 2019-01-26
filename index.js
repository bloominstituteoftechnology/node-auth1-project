const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const protects = require('./middleware.js')
const KnexSessionStore = require('connect-session-knex')(session)

const db = require('./database/dbConfig.js')

const server = express();
const PORT = 5050;

const sessionConfig = {
    secret:'This-is-a-secret!',
    name:'superMonkey',
    httpOnly:true,
    resave:false,
    saveUninitialized:false,
    cookie:{
        secure:false,
        maxAge: 1000 * 60 *01
    },
    //does not work when added
    // store: new KnexSessionStore({
    //     tablename: "sessions",
    //     sidfieldname: "sid",
    //     knex: db,
    //     createtable: true,
    //     clearInterval: 1000 * 60 * 60,
    //   })
}

server.use(session(sessionConfig))
server.use(express.json());
server.use(cors());


server.post('/api/register', (req, res) =>{
    const user = req.body;
    const hash = bcrypt.hashSync(user.password, 14);
    user.password = hash;
    if(!user.username || !user.password){res.status(400).json({message:'Please provide username and password!'})}
    db.insertUser(user).first()
    .then(id =>{
        res.session.username = user.username;
        res.json({newUserId: id})
    })
    .catch(err =>{
        res.status(500).json({err})
    })
})

server.post('/api/login', (req, res)=>{
    const creds = req.body;
    db.findByUsername(creds.username)
    .then(user =>{
        if(user && bcrypt.compareSync(creds.password, user.password)){
            req.session.username = user.username
            res.json({welcome:user.username})
        }else{
            res.status(401).json({message:"Invalid username or password!"})
        }
    })
    .catch(err =>{
            res.status(500).json({err})
    })
})

server.get("/api/users", protects.protected,  (req, res) => {
    db.getUsers()
      .then(users => {
        res.json(users);
      })
      .catch(err => res.status(500).json(err));
  });

  server.get('/api/logout', (req, res)=>{
      if(req.session){
          req.session.destroy(err=>{
              if(err){
                  res. send('Not allowed to leave')
              }else{
                  res.send('See You Next Time!')
              }
          })
      }
  })
server.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}!`)
})