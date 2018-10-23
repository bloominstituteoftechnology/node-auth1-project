console.log('index.js says hi....hi!');

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs'); //bring in the bcryptjs
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const db = require('./data/dbConfiguration.js');

const server = express();

//setting up the Cookies
const sessionConfig = {
  secret: 'bananas.are.gross',
  name: 'monkeybutts',
  httpOnly: true,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 1 //cookie timer
  },
  //need to add store!!!!!!!!!!!
  store: new KnexSessionStore({
    tablename: 'session',
    sidfieldname: 'sid',
    knex: db,
    createtable: true,
    clearInterval: 100 * 60 * 60,
  }),
};

server.use(session(sessionConfig));
server.use(express.json());
server.use(cors());

//server tester message
server.get('/', (req, res) => {
  res.send('Its Alive!');
});

//MVP Login/Register
server.post('/register', (req, res) => { 
  const credentials = req.body;

    const hash = bcrypt.hashSync(credentials.password, 14);
  credentials.password = hash;

  db('users').insert(credentials).then(ids => {
    const id = ids[0];
    res.status(201).json({ newUserId: id })
  })
  .catch(err => {
    res.status(500).json(err);
  });
});

server.post('/login', (req, res) => {
  const credentials = req.body;
  db('users').where({username: credentials.username}).first().then(user => {
//compareSync is how we figure that out, compares the given password and the 
//actual password
if(user && bcrypt.compareSync(credentials.password, user.password)) {
  //checking session username matches given
  req.session.username = user.username
  res.status(200).json({ welcome: user.username })
    } else {
      res.status(401).json({ message: "Entry Denied!" })
    }
  })
  .catch(err => res.status(500).json({ err }));
});

//grab all users
server.get('/users', protected, (req, res) => {
  db('users')
    .select('id', 'username', 'password')// we normally wouldn't have it return the password
    .then(users => {
      res.json({ userId: req.session.userId, users });
    })
    .catch(err => res.send(err));
});

server.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.send("Nope! You can't leave ever! Mwhahaahha!");
      } else {
        res.send("I guess you can leave if you want...")
      }
    });
  }
});

function protected(req, res, next) {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.status(401).json({ message: "Not Authorized"});  
  }
}

server.listen(9000, () => console.log('\n API running mad circles on port 9000\n'));
