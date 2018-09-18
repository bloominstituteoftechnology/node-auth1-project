const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);



const db = require('./db/dbConfig.js');

const server = express();

server.use(express.json());
server.use(cors());
server.use(helmet());

server.get('/', (req, res) => {
  res.send('Hello!');
});

const sessionConfig = {
  name: 'kitty', // default is connect.sid
  secret: 'kitties are cool',
  cookie: {
    maxAge: 1 * 24 * 60 * 60 * 1000, // a day
    secure: false, // only set cookies over https. Server will not send back a cookie over http.
  }, // 1 day in milliseconds
  httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
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

server.use(session(sessionConfig));










//endpoints
server.post('/api/register', (req, res) => {
  const creds = req.body;
  const hash = bcrypt.hashSync(creds.password, 8);
  creds.password = hash;

  db('users')
  .insert(creds)
  .then(ids => {
    const id = ids[0];
    res.status(201).json(id);
})
.catch(err => res.status(500).send(err))
});



server.post('/api/login', (req ,res) => {
  const creds = req.body;

   db('users')
  .where({username: creds.username})
  .first()
  .then(user => {
   if (user && bcrypt.compareSync(creds.password, user.password)) {
    res.send(200).json({ message: 'login successful'});
      } else {
        res.status(401).json({ message: 'incorrect login' });
      }
  })
  .catch(err => res.status(500).json(err))
});


server.get('/api/users', (req, res) => {

  db('users')
  .select('id', 'username', 'password')
  .then(users => {
    res.status(200).json(users)
  })
  .catch(err => res.status(500).json({message: 'error has occured'}))
})








const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
