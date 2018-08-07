const db = require('../data/db')

module.exports = {
  getUsers: (req, res, next) => {
    db('users')
      .select('username')
      .then(users => res.status(200).json(users.map(user => user.username)))
      .catch(next)
  }
}
