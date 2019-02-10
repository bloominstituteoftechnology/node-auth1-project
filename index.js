const express  = require('express');
const session  = require('express-session');
const sessionStore = require('connect-session-knex')(session);
const helmet   = require('helmet');
const morgan   = require('morgan')
const cors     = require('cors')

const bcrypt   = require('bcryptjs');
const db       = require('./data/dbConfig.js')

const sessionsConfig = {
  name: 'notsession', // default is connect.sid
  secret: 'nobody tosses a dwarf!',
  cookie: {
    maxAge: 1 * 24 * 60 * 60 * 1000,
    secure: false, // only set cookies over https. Server will not send back a cookie over http.
  }, // 1 day in milliseconds
  httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
  resave: false,
  saveUninitialized: false,
  store: new sessionStore({
    tablename:'sessions',
    sidfieldname: 'sid',
    knex : db,
    createtable: true,
    clearInterval: 1000 * 60 * 10,
  }),
}

const PORT   = 5050;

const server = express();
server.use(express.json()); 
server.use(cors('localhost:5050'))
server.use(
            helmet(),
            morgan('dev'),
          );
server.use(session(sessionsConfig))
//endpoints

server.post("/api/login",(req, res) =>{
  const creds = req.body;
  db("users")
    .where("username", creds.username).first()
    .then(user => { 
    if( user && bcrypt.compareSync(creds.password, user.password)){
      req.session.user = user
      res.status(202).send("user logged in");
    }
    else{
      res.status(401).send("invalid username or password");
    }
    })
    .catch(err =>{
      res.status(500).send(err);
    })
})

server.post("/api/register", (req, res) => {
  const user = req.body;
  user.password = bcrypt.hashSync(user.password);
  db("users")
    .insert(user)
    .then(id => {
      res.status(201).send({ message: `id ${id} created` });
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

function protected(req, res, next ){
  if (req.session && req.session.user){
  next();
  }else{
    res.status(401).json({msg:"Not authenticated"})
  }
}

server.get('/api/users',protected ,(req, res) =>{
  db('users')
  .select('id', 'username')
  .then(users => {
    res.json(users);
  })
  .catch(err => res.send(err));
})

server.get('/api/logout', (req, res) => {
  if(req.session){
    req.session.destroy(err =>{
      if(err){
        res.status(500).send("server error unable to logout ")
      }else{
        res.status(200).send("user completely logout")
      }
    })
  }else{
    res.json({msg:"already logoff"})
  }
})


//listen
server.listen(PORT, () =>{
  console.log(`\n=== Web API Listening on http://localhost:${PORT} ===\n`);
})