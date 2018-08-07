const userRouter = require('./api/users/userRouter')
const restrictedRouter = require('./api/restricted/restrictedRouter')
const authRouter = require('./auth/authRouter')

module.exports = (server) => {
  server.use('/api/users', userRouter)
  server.use('/api/restricted', restrictedRouter)
  server.use('/', authRouter)
}
