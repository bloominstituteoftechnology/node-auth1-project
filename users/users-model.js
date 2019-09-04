const db = require('../data/dbConfig.js');
const bcrypt = require('bcryptjs');

module.exports = {
  add,
  find,
  findBy,
  findById,
  restricted
};

function find() {
  return db('users').select('id', 'username', 'password');
}

function findBy(filter) {
  return db('users').where(filter);
}

function add(user) {
  return db('users')
    .insert(user, 'id')
    .then(ids => {
      const [id] = ids;
      return findById(id);
    });
}

function findById(id) {
  return db('users')
    .where({ id })
    .first();
}

function restricted(req, res, next) {
    const {username, password} = req.headers;
  
    if (username && password) {
      findBy({username})
        .first()
        .then(user => {
          if(user && bcrypt.compareSync(password, user.password)) {
            next();
          } else {
            res.status(401).json({message: 'invalid credentials'})
          }
        })
        .catch(err => {
          res.status(500).json({message: 'unexpected error'})
        })
    } else {
      res.status(400).json({ message: 'Invalid Credentials'});
    }
}