const usersRouter = require('../users/usersRouter');

module.exports = server => {
    server.use('/', usersRouter);
}