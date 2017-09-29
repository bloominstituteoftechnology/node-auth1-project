const authRoutes = require('./auth');
const userRoutes = require('./user');
const restrictedRoutes = require('./restricted');

const { authenticatedRoute } = require('../utils/authenticatedRoute');

module.exports = (server) => {
  server.use('/auth', authRoutes);
  server.use('/user', userRoutes);
  server.use('/restricted', authenticatedRoute, restrictedRoutes);

  // Handle unspecified routes
  server.use((req, res) => res.status(404).json({
    error: `Unable to resolve ${req.originalUrl}`
  }));
};
