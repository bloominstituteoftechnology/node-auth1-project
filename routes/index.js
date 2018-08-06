const userRouter = require('./api/users/userRouter')
const authRouter = require('./api/authRouter')

module.exports = (server) => {
  console.log('routers online')
  server.use('/api/users', userRouter)
  server.use('/api', authRouter)
}
