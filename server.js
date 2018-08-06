const express = require('express');
const server = express();

const registerRoutes = require('./router/registerRouter');
// const loginRoutes = require('./router/loginRouter');
const usersRoutes = require('./router/usersRouter');

const errors = require('./middleware/errors');
const {} = require('./middleware');

server.use(express.json());
const PORT = 3000;

// base endpoints here
server.get('/', (req, res) => {
  res.send('working...');
});

// register routes
server.use('/api/register', registerRoutes);
// server.use('/api/login', loginRoutes);
server.use('/api/users', usersRoutes);
// server.use('/api/restricted', restrictedRoutes);

// error handling
server.use(errors);

// not found - 404
server.use((req, res) => {
  res.status(404).send(`<h1>404: resource "${req.url}" not found</h1>`);
});

server.listen(
  PORT,
  console.log(`\n=== Web API Listening on http://localhost:${PORT} ===\n`),
);
