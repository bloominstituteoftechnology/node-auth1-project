const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectionToDB = require('./db/db');
const userRouter = require('./User/user.router');
const session = require('express-session');
const sessionOptions = require('./session/session.config');

const MongoStore = require('connect-mongo')(session);
const MongoStore_options = {
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 1000 * 60 * 60, // 1hour -> This override the 'cookie' expiration time at 'cokkie.maxAge'
  }),
};

connectionToDB.connectTo('auth_i');
const server = express();

const corsOptions = {
  // origin: 'http://localhost:3000',
  // methods: [], // authorized HTTP verbs -> if ommit allow all HTTP verbs
  credentials: true,
};

server.use(cors({ corsOptions }));
server.use(express.json());

console.log({ ...sessionOptions, ...MongoStore_options });
server.use(session({ ...sessionOptions, ...MongoStore_options }));

server.get('/', (req, res) => {
  // req.session.loggedIn ? res.send('You are already logged in!') : res.send('API Running...');
  req.session.loggedIn ? res.send({ REQ_SESSION: req.session }) : res.send({ REQ_SESSION: req.session });
});
server.use('/api', userRouter);

const PORT = 6666;
server.listen(PORT, () => console.log(`\n**** Yuhuuu! Server listening at port ${PORT} ****\n`));

/*
defineMethod(Session.prototype, 'destroy', function destroy(fn) {
  delete this.req.session;
  this.req.sessionStore.destroy(this.id, fn);
  return this;
});
*/
