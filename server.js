const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const uuidv1 = require('uuid/v1');
const apiRoutes = require('./api/apiRoutes');

const server = express();
const port = 8000;
const sessVals = { 
  genid: () => uuidv1(),
  secret: 'lambda', 
  cookie: { maxAge: 60000 }
};

server.use(helmet());
server.use(cors());
server.use(express.json());
server.use(session(sessVals));
server.use('/api', apiRoutes);

server.get('/', (req, res) => {
  res.send('The auth server is running...')
});

server.listen(port, () => console.log(`\n==== API running on port ${port} ====\n`));