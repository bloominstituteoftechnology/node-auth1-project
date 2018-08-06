const routeAuth = require('./Routes/auth')
module.exports = (server) => {
  server.use('/api', routeAuth)
}
