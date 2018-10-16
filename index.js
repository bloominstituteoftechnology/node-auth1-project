const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session')
const KnexSessionStore = require('connect-session-knex')(session);
const db = require('./dbConfig.js');

const server = express();

// configure express-session middleware
server.use( session({
  name: 'kittyduckling', // default is connect.sid
  secret: 'q3456STHw45^ $#7Q@@#+',
  cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day in milliseconds
      secure: false, // only set cookies over https. Server will not send back a cookie over http.
  }, 
  httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
  resave: false,
  saveUninitialized: true,
  store: new KnexSessionStore({
    tablename: "session",
    sidfieldname: 'sid',
    knex: db,
    createtable: true,
    clearInterval: 1000*60*60
    })
  })
);

server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
  res.send('Its Alive!');
});

server.post('/api/register', (req, res)=> {
  const credentials = req.body;

  //hash the password
  const hash = bcrypt.hashSync(credentials.password, 14);
  credentials.password = hash;

  //then save the user
  db('users').insert(credentials)
            .then(ids =>{
              const id = ids[0];
              //req.session.username = credentials.username;
              res.status(201).json({newUserId: id})
            })
            .catch(err=> res.send(err));
});

server.post('/api/login', checkLoggedIn, (req, res)=>{
  const creds = req.body;
  db('users') .where({username:creds.username})
              .first()
              .then(user=>{
                if(user&& bcrypt.compareSync(creds.password, user.password)){
                    req.session.username = user.username;
                    res.status(200).json({message: "Logged in"});
                } else{
                  res.status(401).json({message: 'you shall not pass!'});
                }
              })
              .catch(err=> res.status(500).json({err}));
});

//middleware to protect endpoints
function checkLoggedIn (req, res, next) {
  if (req.session && req.session.username) { 
    next();
  } else {
    res.status(401).json({ message: 'protected failed' });
  }
}

// protect this route, only authenticated users should see it
server.get('/api/users', checkLoggedIn, (req, res) => {
    db('users') .select('id', 'username')
                .then(users=>{
                  res.status(200).json(users);
                })
                .catch(err=> res.status(500).json({err}));
});

server.get('/api/logout', (req, res) => {
    if (req.session) {
      req.session.destroy(err => {
        if (err) {
          res.send('error logging out');
        } else {
          res.send('good bye');
        }
      });
    }
  });

server.listen(3300, () => console.log('\nrunning on port 3300\n'));