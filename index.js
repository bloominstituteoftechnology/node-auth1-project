const express = require('express');
const helmet = require('helmet');
const server = express();
server.use(helmet());
server.use(express.json());

// server config
const port = 7100; // port for server to run from
const serverName = `auth-i`; // Name of server to display at "/" endpoint 

// endpoint routing
// const projectRoutes = require('./routes/projectRoutes');
// const actionRoutes = require('./routes/actionRoutes');
// server.use('/api/projects', projectRoutes);
// server.use('/api/actions', actionRoutes);

// server endpoints

server.get('/', (req, res) => { // sanity check
  res.send(`${serverName} running on port ${port}`);
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

server.listen({ port }, () => console.log(`## ${serverName} running on port ${port} ##`));