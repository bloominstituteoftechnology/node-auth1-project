const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const server = express();
const session = require('express-session'); // session library to handle cookies and authentication
const KnexSessionStore = require('connect-session-knex')(session); // knex sqlite db support for express-session

const bcrypt = require('bcryptjs');
server.use(helmet());
server.use(cors());
server.use(express.json());
const db = require('./data/dbConfig.js'); // database configuration file location

// CONFIG: server settings
const serverPort = 7100; // server port
const serverName = `auth-i`; // Name of server to display at "/" endpoint 
const serverRepo = `https://github.com/LambdaSchool/auth-i/pull/341`;

// CONFIG: endpoint routing
// const users = require('./data/routes/usersRoutes');
// server.use('/api/users', users);

// CONFIG: Models
const users = require('./data/models/usersModels');

// CONFIG: express-session
const sessionConfig = {
  secret: 'its.a.secret.to.everybody',
  name: 'lambda', // defaults to connect.sid
  httpOnly: true, // JS cannot access this session
  resave: false,
  saveUninitialized: false, // Legally obligated!
  cookie: {
    secure: false, // over https false
    maxAge: 1000 * 60 * 1 // 1000 ms * 60 seconds * 1 minute 
  },
  store: new KnexSessionStore({
    tablename: 'sessions', // this is the tablename of the session store
    sidfieldname: 'sid', // this is the field name that stores the session id
    knex: db, // name of configured knex database
    createtable: true, // this option creates the table automatically if it doesn't exist
    clearInterval: 1000 * 60 * 60, // removes only expired sessions
  })
}
server.use(session(sessionConfig)) // lets the express server use the session config from connect-session-knex

// ENDPOINTS
server.get('/', (req, res) => { // sanity check root endpoint
  res.send(`${serverName} running on port ${serverPort}<br>More information: <a href="${serverRepo}">GitHub Repo</a>`);
});

server.post('/api/login', (req, res) => { // api login endpoint
  const creds = req.body; // store body of post request in credentials variable
  db('users').where({ username: creds.username }) // search users db for username
    .first() // return first result
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        req.session.username = user.username;
        // check if user exists and user bcrypt hashed password with submitted password
        res.status(200).json({ message: `Authentication success. Welcome ${user.username}.` })
      } else {
        res.status(401).json({ message: 'Authentication failed.' })
      }
    })
    .catch(err => res.status(500).json({ err }));
});

server.post('/api/register', (req, res) => { // api register endpoint
  const credentials = req.body; // store body of post request in credentials variable
  const hash = bcrypt.hashSync(credentials.password, 14) // hash the password
  credentials.password = hash; // store hashed password on the credentials object
  db('users')
    .insert(credentials)
    .then(ids => {
      const id = ids[0];
      req.session.username = credentials.username; // THIS DOESN'T WORK
      res.status(201).json({ newUserId: id });
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

server.get('/api/users', protected, (req, res) => { // api user list endpoint
  users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

server.get('/api/users/:id', protected, (req, res) => { // view one user based off id and related actions
  const { id } = req.params;
  users.find(id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: 'ERROR: User not found.' });
      }
    })
    .catch(err => res.json(err));
})

server.get('/api/logout', (req, res) => { // endpoint to logout of session
  if (req.session) {
    req.session.destroy(err => { // destroys the user's cookie
      if (err) {
        res.send("Logout failed")
      } else {
        res.send("Logout success")
      }
    })
  }
});

function protected(req, res, next) {
  if (req.session && req.session.username) {  // check if user is on session
    next();
  } else {
    res.status(401).json({ message: 'ERROR: Authentication failed' })
  }
}

server.listen(serverPort, () => console.log(`## ${serverName} running on port ${serverPort} ##`));