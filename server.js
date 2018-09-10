const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const server = express();

server.use(express.json());
server.use(cors{});
server.use(helmet());

const PORT = 8000;
server.listen(PORT, () => console.log(`SERVER = PORT: ${PORT} = LISTENING`));
