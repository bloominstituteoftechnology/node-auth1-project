const db = require('../data/db.js')

module.exports = {
  knex: db,
  clearInterval: 1000 * 60
}
