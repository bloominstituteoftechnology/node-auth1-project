const express = require('express');
const server = express();
const session = require('express-session');

const registerRoutes = require('./router/registerRouter');
const restrictedRoutes = require('./router/restrictedRouter');
const loginRoutes = require('./router/loginRouter');
const logoutRoutes = require('./router/logoutRouter');
const usersRoutes = require('./router/usersRouter');

const errors = require('./middleware/errors');
const {} = require('./middleware');

server.use(express.json());
server.use(
  session({
    secret: 'FiLQ39OotgLDn6A7ONNL0MjpMEpXodvArdzxzlvSYeSaC4sQQmt0pg34VOV5paJ',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // must be false, unless using HTTPS
  }),
);
const PORT = 3000;

// base endpoints here
server.get('/', (req, res) => {
  res.send('working...');
});

// register routes
server.use('/api/register', registerRoutes);
server.use('/api/login', loginRoutes);
server.use('/api/logout', logoutRoutes);
server.use('/api/users', usersRoutes);
server.use('/api/restricted', restrictedRoutes);

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
