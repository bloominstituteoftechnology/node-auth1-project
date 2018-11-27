const usersRouter = require('../users/usersRouter');
const restrictedRouter = require('../users/restricted');

module.exports = server => {
    server.use('/api/restricted', restrictedRouter, )
    server.use('/', usersRouter);
}