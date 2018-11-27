const authRouter = require('./authentication/authRoutes');

module.exports = app => {
  app.use('/api', authRouter);
};
