const express = require('express');
const cors = require('cors');
const connectionToDB = require('./db/db');
const userRouter = require('./User/user.router');
const session = require('express-session');
const sessionOptions = require('./session/session.config');

connectionToDB.connectTo('auth_i');
const server = express();

server.use(cors({}));
server.use(express.json());
server.use(session(sessionOptions));

server.get('/', (req, res) => res.send('API Running...'));
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
