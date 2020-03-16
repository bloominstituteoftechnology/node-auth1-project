function Goldberg  (req, res, next) {
  console.log(`There was a ${req.method} request to endpoint: ${req.url} at ${Date()}`);
  next();
};

module.exports = Goldberg;
