const server = require('express')();
const port = 5000;
const dbConnection = require('./dbConnection');
const register = require('./routes/register');
const login = require('./routes/login');

server.use(require('express').json());
server.use(require('express-session')({
  secret: '6CLkzW9rSGmuk8ALKXc68zkuvYQSEDBeTS4v8LkPLYkr6Ljc4M',
  cookie: {
    maxAge: 1 * 24 * 60 * 60 * 1000
  },
  resave: true,
  saveUninitialized: false,
  name: 'noname'
}));
server.use('/api/register', register);
server.use('/api/login', login);

server.get('/', (req, res) => {
  res.status(200).send('Authentication API');
});

server.listen(port, () => {
  console.log(`\n*** Listening on port ${port} ***\n`);
});