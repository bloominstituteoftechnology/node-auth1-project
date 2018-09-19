//module import
const express = require('express');
const helmet = require('helmet');
const knex = require('knex');
const bcrypt = require('bcryptjs')
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session)
//knex config
const dbConfig = require('./knexfile.js')
const db = knex(dbConfig.development);
//server config
const server = express();

// configure express-session middleware I'm not sure I like this so I'm doing to go the  session config route
// server.use(
//   session({
//     name: 'login', // default is connect.sid
//     secret: 'fly you fools!',
//     cookie: {
//       maxAge: 1 * 24 * 60 * 60 * 1000,
//       secure: false, // only set cookies over https. Server will not send back a cookie over http.
//     }, // 1 day in milliseconds
//     httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
//     resave: false,
//     saveUninitialized: false,
//     store: new KnexSessionStore({
//       tablename:"sessions",
//       sidfieldname: 'sid',
//       knex: db,
//       createtable: true,
//       clearInterval: 1000*60*60,
//     })
//   })
// );

//sessionConfig
const sessionConfig = {
  name: 'login',
  secret: 'fly you fools',
      cookie: {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        secure: false, // only set cookies over https. Server will not send back a cookie over http.
      },
      resave:false,
      saveUninitialized:false
}
//middleware configuration
server.use(express.json());
server.use(helmet());
server.use(session(sessionConfig))


//proteced middleware for protected route:
function protected (req, res, next) {
  if(req.session && req.session.username){
    next();
  }
  else{
    res.status(400).json({error: 'Session credentials incorrect for this user' })
  }
}

//----POST ------//
//register
server.post("/api/register", (req, res) => {
 const credentials = req.body;
 const hashnum = bcrypt.hashSync(credentials.password, 14);
 credentials.password = hashnum;

 db("credentials")
   .insert(credentials)
   .then(users => {
     const id = users[0];

     res.status(201).json(id);
   })
   .catch(err => res.status(500).send(err));
});

//login
server.post("/api/login", (req, res) => {
 const credentials = req.body;
 db("credentials")
   .where({ username: credentials.username })
   .first()
   .then(user => {
     if (user && bcrypt.compareSync(credentials.password, user.password) ) {
       //pulling username off user into the cookie
       req.session.username = user.username;
       res.status(200).send(`Hello ${req.session.username}, nice to see you again`);
       //send a cookie back here

     }
     else {
       res.status(401).json({ message: "Man you can't even type right " });
     }
   })
   .catch(err => res.status(500).send(err));
});

//------GET-------//
// need to make this proteced, use middleware
server.get("/api/users", protected, (req, res) => {
 db("credentials")
   .select("id", "username")
   .then(users => {
     res.json(users);
   })
   .catch(err => res.status(500).send(err));
});

//-------Listener--------//
const port = 8000;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
