const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const session = require('express-session');

// routers
const loginRouter = require('./login/index');
const registerRouter = require('./register/index');
const userRouter = require('./users/index');

const server = express();
let sess = {
    secret: 'keyboard cat',
    resave: false,
    httpOnly: true,
    saveUninitialized: true,
    cookie: { secure: false },
    // genid: (req) => genuuid()
}
server.use(cors());
server.use(express.json());
server.use(helmet());

// session
if (server.get('env') === 'production') {
    server.set('trust proxy', 1);
    sess.cookie.secure = true;
}
server.use(session(sess));

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
