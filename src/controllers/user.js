const { server } = require('../server');

module.exports = {
  getAuthenticatedUser: (req, res) => {
    console.log(req.session.user);
    res.sendStatus(200);
  }
};
