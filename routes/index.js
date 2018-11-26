const userRouter = require('./userRouter')
const restrictedRouter = require('./restrictedRouter')
const authRouter = require('./authRouter')

module.exports = server => {
  server.use('/api/users', userRouter)
  server.use('/api/restricted', restrictedRouter)
  server.use('/api/', authRouter)
}
