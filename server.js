const express = require('express');
const cors = require('cors');
const connectionToDB = require('./db/db');
const userRouter = require('./User/user.router');

connectionToDB.connectTo('auth_i');
const server = express();

server.use(cors({}));
server.use(express.json());

server.get('/', (req, res) => res.send('API Running...'));
server.use('/api', userRouter);

const PORT = 6666;
server.listen(PORT, () => console.log(`\n**** Yuhuuu! Server listening at port ${PORT} ****\n`));
