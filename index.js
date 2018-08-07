const express = require('express');
const server = express();
const PORT = 8000;
const bcrypt = require('bcryptjs');
const db = require('./data/dbConfig');
const session = require('express-session');
const cors = require('cors');
let isValid = null;

server.use(express.json());
server.use(cors());
server.use(session({
  name:'something else',
  secret: "nfm0leyJQVuf6v/HDf4CbjFkRv3gGd+fOXULsdf/8rMtnZjgQdS5E006zoiFuVEAO4c=",
  cookie: {maxAge: 1000 * 300}
}));
server.use((req, res, next) => {
  if (req.originalUrl.includes('/api/restricted/')) {
    if (req.session.validated) {
      next()
    } else {
      return res.status(401).send(`Status 401: Access Denied, please log in`);
    }
  }
  next();
});

const authenticate = async (req, res, next) => {
  const credentials = req.body;
  console.log(credentials);
  const foundUser = await db('users').where('username', credentials.username).first();
  const userHash = foundUser.password;
  req.session.validated = bcrypt.compareSync(credentials.password, userHash);
  next();
};

server.get('/api/users', (req, res) => {
  if (req.sessionID = req.session.sessionId) {
    console.log(req.sessionID);
    const users = db('users').then(response => {
      res.status(200).json(response);
    }).catch(err => {
      res.status(500).json(`${err}`);
    });
  } else {
    res.status(401).json({
      status: `401 Denied`,
      message: "You are not logged in"
    });
  }
})

server.post('/api/register', async (req, res) => {
  const user = req.body;
  const hash = bcrypt.hashSync(user.password, 14);
  user.password = hash;

  try {
    if (user.username && user.password) {
      const ids = await db.insert(user).into('users');
      const id = ids[0];
      res.status(201).json(await db('users').where('id', id).first());
    } else {
      throw Error;
    }
  } catch (err) {
    return console.log(`${err}`);
  }
})

server.post('/api/login', authenticate, async (req, res) => {
  if (req.session.validated) {
    req.session.sessionId = req.sessionID;
    res.status(200).json({message:"Logged In", cook:req.sessionID});
  } else {
    res.status(401).json({
      status: 401,
      message: 'You shall not pass!'
    })
  }
});

server.get('/api/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.send('error logging out')
      } else {
        res.send('Logged Out');
      }
    });
  }
});

server.get('/api/restricted/something', (req, res) => {
  res.status(200).send('Somethiiiiing!')
})

server.get('/api/restricted/', (req, res) => {
  res.status(200).send('aaaaaaaaa!');
})

server.listen(PORT, () => console.log(`App is listening on ${PORT}`))
