const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const knex = require('knex');
const bycrypt = require('bcryptjs');
const session = require('express-session')

const server = express();
const port = 3333;

const dbConfig = require('./knexfile');
const db = knex(dbConfig.development);

server.use(express.json());
server.use(cors());
server.use(helmet());



// middleware
const sessionConfig = {
  name: 'noneOfYoBiz',
  secret: 'this is not a secret',
  cookie: {
    maxAge: 1 * 12 * 60 * 60 * 1000,
    secure: false,
  }, 
  httpOnly: true,
  resave: false,
  saveUninitialized: false,
}

const checkForUser = (req, res, next) => {
  req.session && 
  req.session.username && 
  req.session.role === 'user' ?
  next()
  :
  res.status(401).json({message: 'YU SHALL NOT PAWSS'});
}

const checkForAdmin = (req, res, next) => {
  req.session && 
  req.session.username && 
  req.session.role === 'admin' ?
  next()
  :
  res.status(401).json({message: 'YU SHALL NOT PAWSS'});
}

const checkForHr = (req, res, next) => {
  req.session &&
  req.session.username &&
  req.session.role === 'hr' ?
  next()
  :
  res.status(401).json({message: 'YU SHALL NOT PAWSS'});
}


server.use(session(sessionConfig));



// routes
server.get('/', (req, res) => {
  res.send('hello');
});


server.get('/api/users', (req, res) => {
  db('users').select('username')
  .then(users => {
    res.status(200).json(users)
  })
  .catch(err => console.log(err));
});



server.post('/api/register', (req, res) => {

  !req.body.username || !req.body.password || !req.body.role ?
  res.status(400).json({message: 'You need a username AND password AND role'})
  :
  null

  const credentials = req.body;
  const hash = bycrypt.hashSync(credentials.password, 10);
  credentials.password = hash;

  db('users').insert(credentials)
  .then(ids => {
    const id = ids[0];
    res.status(201).json(id);
  })
  .catch(err => {
    console.log(err)
  });

});


server.post('/api/login', (req, res) => {
  
  !req.body.username || !req.body.password ?
  res.status(400).json({message: 'You need a username AND password'})
  :
  null

  const credentials = req.body;

  db('users').where({username: credentials.username}).first()
  .then(user => {
    if (user && bycrypt.compareSync(credentials.password, user.password)) {
      req.session.username = user.username
      req.session.role = user.role
      res.status(200).json({message: `Success! Welcome, ${req.session.username}`})
    } else {
      res.status(401).json({message: 'cannot pass'})
    }
  })
  .catch(err => {
    console.log(err)
  });
});


server.get('/api/logout', (req, res) => {
  
  !req.body.username || !req.body.password ?
  res.status(400).json({message: 'You need a username AND password'})
  :
  null

  const credentials = req.body;

  db('users').where({username: credentials.username}).first()
  .then(user => {
    if (user && bycrypt.compareSync(credentials.password, user.password)) {
      req.session.username = user.username
      res.status(200).json({message: 'success'})
    } else {
      res.status(401).json({message: 'cannot pass'})
    }
  })
  .catch(err => {
    console.log(err)
  });
});


server.get('/api/user/users', checkForUser, (req, res) => {
  db('users').select('id', 'username')
  .then(users => {
    res.status(200).json(users)
  })
  .catch(err => console.log(err));
});


server.get('/api/admin/users', checkForAdmin, (req, res) => {
  db('users').select()
  .then(users => {
    res.status(200).json(users)
  })
  .catch(err => console.log(err));
});


server.get('/api/hr/users', checkForHr, (req, res) => {
  db('users').select('id', 'username', 'role')
  .then(users => {
    res.status(200).json(users)
  })
  .catch(err => console.log(err));
});


server.listen(port, () => console.log(`listening on port ${port}`));
