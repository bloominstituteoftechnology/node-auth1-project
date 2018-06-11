const server = require('express')();
const port = 5000;
const dbConnection = require('./dbConnection');
const register = require('./routes/register');

server.use(require('express').json());
server.use('/api/register', register);

server.get('/', (req, res) => {
  res.status(200).send('Authentication API');
});

server.listen(port, () => {
  console.log(`\n*** Listening on port ${port} ***\n`);
});