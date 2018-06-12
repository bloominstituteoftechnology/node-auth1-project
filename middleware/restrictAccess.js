const RESTRICTED_PATH = '/api/restricted/';

const isLoggedIn = req => {
  return (req.session && req.session.userId) ? true : false;
};

module.exports = (req, res, next) => {
  if (req._parsedUrl.path.indexOf(RESTRICTED_PATH) === 0){
    isLoggedIn(req)
      ? next()
      : res.status(401).json({ error: 'You shall not pass!' });
  } else {
    next();
  }
};