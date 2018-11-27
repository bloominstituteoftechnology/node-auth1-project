
const db = require("./data/dbConfig");
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const bcrypt = require('bcryptjs'); 
const server = express();

const sessionConfig = {
  name: 'Me',
  secret: 'this-is-very-to-guess',
  cookie: {
    maxAge: 1000 * 60 * 10,
    secure: false, // only set it over https; in production you want this true.
  },
  httpOnly: true, // no js can touch this cookie
  resave: false,
  saveUninitialized: false,
  store: new KnexSessionStore({
    tablename: 'sessions',
    sidfieldname: 'sid',
    knex: db,
    createtable: true,
    clearInterval: 1000 * 60 * 60,
  }),
};

server.use(session(sessionConfig)); // wires up session management
server.use(express.json());
server.use(cors());

server.post('/api/login', (req, res) => {
    // grab username and password from body
    const creds = req.body;
  
    db('users')
      .where({ username: creds.username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(creds.password, user.password)) {
          // passwords match and user exists by that username
          req.session.user=user.id;
          res.status(200).json({ message: 'Come on in!' });
        } else {
          // either username is invalid or password is wrong
          res.status(401).json({ message: 'invalid username or password' });
        }
      })
      .catch(err => res.json(err));
  });
server.post("/api/register", (req, res) => {
  const creds = req.body;
  const hash = bcrypt.hashSync(creds.password, 4);
  creds.password = hash;
  db("users")
    .insert(creds)
    .then(ids => {
      res.status(201).json(ids);
    })
    .catch(err => {
      res.send(err);
    });
});
function protected(req,res,next){
  if(req.session && req.session.user){
    next()
  }
  else{
    res.status(401).json({message:'You must log in to access this information'});
  }
}
server.get("/api/users", (req, res) => {
  db("users")
    .select("id", "username", "password")
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});
server.get('/api/me', protected, (req, res) => {
  db('users')
    .select('id', 'username', 'password') // ***************************** added password to the select
    .where({ id: req.session.user })
    .first()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});
server.get('/', (req, res) => {
    res.send('Its Alive!');
  });

  server.get('/api/logout', (req, res) => {
    if (req.session) {
      req.session.destroy(err => {
        if (err) {
          res.send('logout failed');
        } else {
          res.send('logout sucess');
        }
      });
    } else {
      res.end();
    }
  });
server.listen(3300, () => console.log("alive at 3300"));
