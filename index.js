const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const server = express();
const bcrypt = require('bcryptjs');
server.use(helmet());
server.use(cors());
server.use(express.json());
const db = require('./data/dbConfig.js');
// server config
const serverPort = 7100; // server port
const serverName = `auth-i`; // Name of server to display at "/" endpoint 
const serverRepo = `https://github.com/LambdaSchool/auth-i/pull/341`;

// endpoint routing
// const projectRoutes = require('./routes/projectRoutes');
// const actionRoutes = require('./routes/actionRoutes');
// server.use('/api/projects', projectRoutes);
// server.use('/api/actions', actionRoutes);

// server endpoints

server.get('/', (req, res) => { // sanity check
  res.send(`${serverName} running on port ${serverPort}<br>More information: <a href="${serverRepo}">GitHub Repo</a>`);
});

server.get('/api/users', (req, res) => { // api user list endpoint
  db('users')
    .select('id', 'username', 'password')
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

server.post('/api/login', (req, res) => { // api login endpoint
  const creds = req.body;

  db('users').where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        // found the user
        res.status(200).json({ message: `Authentication success. Welcome ${user.username}.` })
      } else {
        res.status(401).json({ message: 'Authentication failed.' })
      }
    })
    .catch(err => res.status(500).json({ err }));
});

server.post('/api/register', (req, res) => { // api register endpoint
  const credentials = req.body;

  // hash the password
  const hash = bcrypt.hashSync(credentials.password, 14)
  credentials.password = hash;
  db('users')
    .insert(credentials)
    .then(ids => {
      const id = ids[0];
      res.status(201).json({ newUserId: id });
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

server.listen(serverPort, () => console.log(`## ${serverName} running on port ${serverPort} ##`));