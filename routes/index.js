const userRouter = require('./api/users/userRouter')
const authRouter = require('./auth/authRouter')
const restrictedRouter = require('./api/restricted/restrictedRouter')

module.exports = (server) => {
  server.use('/api/users', userRouter)
  server.use('/', authRouter)
  server.use('/api/restricted', restrictedRouter)
}
