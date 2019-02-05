const knex = require('knex')

const config = require('../../knexfile')

const DB = knex(config.development)

module.exports = {
 place: (user) => {
  return DB('users')
           .insert(user)
 },

 getByUser: (username) => {
  return DB('users')
           .where('username', username)
 }
}