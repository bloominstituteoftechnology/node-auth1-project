const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const server = express();
const bcrypt = require('bcryptjs');
server.use(helmet());
server.use(cors());
server.use(express.json());
const db = require('./data/dbConfig.js'); // database configuration file location

// server config
const serverPort = 7100; // server port
const serverName = `auth-i`; // Name of server to display at "/" endpoint 
const serverRepo = `https://github.com/LambdaSchool/auth-i/pull/341`;

// endpoint routing
const users = require('./data/routes/usersRoutes');
server.use('/api/users', users);

// server endpoints
server.get('/', (req, res) => { // sanity check
  res.send(`${serverName} running on port ${serverPort}<br>More information: <a href="${serverRepo}">GitHub Repo</a>`);
});

server.post('/api/login', (req, res) => { // api login endpoint
  const creds = req.body; // store body of post request in credentials variable
  db('users').where({ username: creds.username }) // search users db for username
    .first() // return first result
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
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
      res.status(201).json({ newUserId: id });
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

server.listen(serverPort, () => console.log(`## ${serverName} running on port ${serverPort} ##`));