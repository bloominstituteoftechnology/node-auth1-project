const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);



const db = require('./db/dbConfig.js');

const server = express();





const sessionConfig = {
  name: 'kitty', 
  secret: 'kitties are cool',
  cookie: {
    maxAge: 1 * 24 * 60 * 60 * 1000, 
    secure: false, 
  }, 
  httpOnly: true, 
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


server.use(express.json());
server.use(cors());
server.use(helmet());



function protected(req, res, next) {
  if (req.session && req.session.username) {
    next();
  } else {
    res.status(401).json({ message: 'you cannot sit with us' });
  }
}


server.get('/', (req, res) => {
  res.send('Hello!');
});






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
    req.session.username = user.username;
    res.send(200).json({ message: `Welcome ${req.session.username}`});
      } else {
        res.status(401).json({ message: 'incorrect login' });
      }
  })
  .catch(err => res.status(500).json(err))
});

server.get('/api/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.send('not able to log out');
      } else {
        res.send('Bye!');
      }
    });
  }
});

server.get('/setname', (req, res) => {
  req.session.name = 'Lana';
  res.send('it worked!');
});

server.get('/greet', (req, res) => {
  const name = req.session.username;
  res.send(`hello ${name}`);
});

server.get('/api/users', protected, (req, res) => {

  db('users')
  .select('id', 'username','password')
  .then(users => {
    res.status(200).json(users)
  })
  .catch(err => res.status(500).json({message: 'error has occured'}))
})









const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
