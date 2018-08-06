const userRouter = require('./api/users/userRouter')

module.exports = (server) => {
  server.use('/api/users', userRouter)
}
