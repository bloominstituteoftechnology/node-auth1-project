const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const { restrictAccess } = require('./middlewares');

mongoose.connect('mongodb://localhost/userauthdb')
.then(conn => {
    console.log(`\n=== connected to database ===\n`);
})
.catch(err => {
    console.log(`error connecting to database: ${err}`);
})

const authRoutes = require('./routes');
const userRoutes = require('./routes/users');

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use(
  session({
    name: 'auth',
    secret: 'you shall not pass',
    resave: 'true',
    saveUninitialized: false,
    cookies: { maxAge: 1 * 24 * 60 * 1000 },
    secure: false,
    store: new MongoStore({
        url: `mongodb://localhost/sessions`,
        ttl: 10 * 60
    })
  }),
);
server.use(restrictAccess);

server.use('/api', authRoutes);
server.use('/api', userRoutes);

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`\n=== API running on port ${port} ===\n`));