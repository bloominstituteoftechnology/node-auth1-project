const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const server = express();

server.use(express.json());
server.use(helmet());
server.use(cors());



server.get('/', (req, res) => {
  res.send('This sshizz working?');
});

const port = 9001;
server.listen(port, () => console.log(`******* Running on power level ${port} *******`));