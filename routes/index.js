const userRouter = require('./api/users/userRouter')
const authRouter = require('./auth/authRouter')

module.exports = (server) => {
  server.use('/api/users', userRouter)
  server.use('/', authRouter)
}
