const db = require('../data/db.js')

module.exports = {
  knex: db,
  clearInterval: 60 * 60 * 1000
}
