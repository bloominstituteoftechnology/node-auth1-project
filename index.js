const cors = require('cors');
const express = require('express');
const helmet = require('helmet');

// routers
const loginRouter = require('./login/index');
const registerRouter = require('./register/index');
const userRouter = require('./users/index');

const server = express();
server.use(cors());
server.use(express.json());
server.use(helmet());

// mount routers
server.use('/api/login', loginRouter);
server.use('/api/register', registerRouter);
server.use('/api/users', userRouter);

server.get('/', (req, res) => {
    res.status(200).send(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});

server.use(function (req, res) {
    res.status(404).json({ error: "Ain't nobody got time for that!" });
});

const port = 8000;
server.listen(port, function () {
    console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
