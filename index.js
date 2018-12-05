const express = require('express'); 
const helmet = require('helmet');
const knexConfig = require('./knexfile');
const knex = require('knex');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

// configure express-session
const sessionConfig = {
    name: 'lbbc',
    secret: 'hare krisha. krishna krishna. Hare hare. Hare rama rama. Hare hare.',
    cookie: {
      maxAge: 1000 * 60 * 10,
      secure: false, // Has to be https. In production must be set to False.
    },
    httpOnly: true, // view protected from js. js can't see this
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

const server = express();

//Initialize db
const db = knex(knexConfig.development);

//Connect Middleware to Server 
server.use(helmet(), express.json());

// SANITY CHECK
server.get('/', (request, response) => {
    response.send("Let's GO!")
});


server.post('/api/register', (req, res) => {
    
    const creds = req.body;
    
    const hash = bcrypt.hashSync(creds.password, 16); 
   
    creds.password = hash;
    
    db('users')
    .where({ username: creds.username })
    .then(user => {
        if (user) {
        res.status(409).json({ message: 'username is already taken' });
        } else {
        db('users')
        .insert(creds)
        .then(ids => {  
            res.status(201).json(ids);
        })
        }
    })
    .catch(err => res.json(err));
});

server.post('/api/login', (req, res) => {
    
    const creds = req.body;
  
    db('users')
      .where({ username: creds.username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(creds.password, user.password)) {
         
          res.status(200).json({ message: 'Benvenuto!' });
        } else {
          
          res.status(401).json({ message: 'Access Denied!' });
        }
      })
      .catch(err => res.json(err));
  });
  
  


server.listen(8888, () => console.log('\nrunning on port 8888\n'));