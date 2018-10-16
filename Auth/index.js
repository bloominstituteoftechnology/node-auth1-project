const express = require('express');

const session = require('express-session');

const KnexSessionStore = require('connect-session-knex')(session);

const cors = require('cors');

const db = require('./database/dbConfig.js');

const bcrypt = require('bcryptjs');

const server = express();

const cookieTime = (req, res, next) => {
  if (req.session && req.session.username) {
    next();
    } else {
      res.status(401).send('Not authorized');
    }
  }


const sessionConfig = {
    name:'notsession', ///we want to change to anon session software
    secret:'something%dwarf#something',
    cookie: { 
      secure: false,
      maxAge: 1000 * 60 * 1
    },
    httpOnly: true, ///block JS
    resave: false,
    saveUninitialized: false,
    store: new KnexSessionStore({
      tablename: 'sessions',
      sidefieldname: 'sid',
      knex: db,
      createtable: true,
      clearIntervale: 1000 * 60 * 60,
    }),
};

server.use(
  express.json(), 
  cors(),
  session(sessionConfig),
);

server.get('/', (req, res) => {
  res.send('Werk Werk');
});

server.post('/register', (req, res) => {
  const credentials = req.body; 

  const hash = bcrypt.hashSync(credentials.password, 14);
  credentials.password = hash;

  db('users').insert(credentials).then(ids => {
    const id = ids[0];
    req.session.username = credentials.username;  
    res.status(201).json({ newUserId: id})
  })
   .catch(err => {
     res.status(500).json(err);
   });
});

server.post('/login', (req, res) => {
  const creds = req.body;

  db('users')
    .where({username: creds.username})
    .first()
    .then(user => {
    if (user && bcrypt.compareSync(creds.password, user.password)) {
      req.session.username = user.username;
      res.status(200).json({welcome: user.username})
    }
    else {
      res.status(401).json({message: 'You just cannot enter. That is all.'})
    }
  })
  .catch(err => req.status(500).json({ message: 'Something went wrong...on our end.'}));

})
////////Per the notes from lecture.
// protect this route, only authenticated users should see it
server.get('/users', cookieTime, (req, res) => {
    db('users')
      .select('id', 'username', 'password')
      .then( users => {
        res.json(users);
      })
      .catch(err => res.send(err));
});

server.get('/logout', (req, res) => {
  if(req.session) {
    req.session.destroy(err => {
      if(err) {
        res.send('You will stay.')
      }
      else {
        res.send('See ya');
      }
    });
  }
});

//////Day 2
// server.get('/getname', (req, res) => {
//   const name = req.session.name;
//   res.send(`hello ${name}`);
// });

// server.get('/setname', (req, res) => {
//   req.session.name = 'Frodo';
//   res.send('received');
// });



server.listen(7700, () => console.log('\nrunning on port 7700\n'));
