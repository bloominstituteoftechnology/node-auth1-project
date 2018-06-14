const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const User = require('./User');
const session = require('express-session')

const db = require('./db.js');

const server = express();

db
  .connectTo('users')
  .then(() => console.log('\n... API Connected to Database ...\n'))
  .catch(err => console.log('\n*** ERROR Connecting to Database ***\n', err));

server.use(helmet());
server.use(express.json());
server.use(session ({ secret: 'super secret password', name: 'vccookie'}))

const checkAuthorization = ( req, res, next ) => {
  const { session } = req;
  if (session.isLoggedIn) {
    return next()
  } else {
    res.status(401).json({ msg: 'UNAUTHORIZED'})
  }
}


server.get('/', (req, res) => res.send('API Running...'));

const port = process.env.PORT || 5000;
server.listen(port, () =>
  console.log(`\n\nAPI running on http://localhost:${port}`)
);

server.post('/api/register', (req, res) => {
  const user = new User(req.body);
  user.save()
    .then( user => res.status(201).json('User added!'))
    .catch( err => res.status(500).send(err))
});


server.get('/api/users', checkAuthorization, (req, res) => {
  User.find()
    .then(users => res.status(201).json(users))
    .catch(err => res.status(500).send(err))
});

server.put('/api/login', (req, res) => {
  if(!req.body.username || !req.body.password) {
    res.sendStatus(400)
  }
  const { username, password } = req.body;
  User.findOne({ username })
    .then( user => {
      user.comparePasswords( password, isMatch => {
        if(isMatch) {
          req.session.isLoggedIn = true;
          req.session.username = user.username;
          res.status(200).json({msg: 'Logged In!'})
        } else {
          res.status(401).json({msg: 'PASSWORD INCORRECT!'})
        }
      }) 
    })
    .catch( err => {
      res.status(500).json({ error: 'Error getting username', err});
    })
})

server.get('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    res.sendStatus(204)
  })
});

// POST	/api/login	Use the credentials sent inside the body to login the user. On successful login, create a new session for the user and send back a 'Logged in' message and a cookie that contains the user id. If login fails, repond with the correct status code and the message: 'You shall not pass!'
// GET	/api/users	If the user is logged in, respond with an array of all the users contained in the database. If the user is not logged in repond with the correct status code and the message: 'You shall not pass!'. Use this endpoint to verify that the password is hashed before it is saved.
