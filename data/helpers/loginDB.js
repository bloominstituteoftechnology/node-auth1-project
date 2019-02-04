const knex = require('knex')

const config = require('../../knexfile')

const DB = knex(config.development)

module.exports = {
 post: () => {
  return DB('users')
           .where('username', user.username)
 }
}