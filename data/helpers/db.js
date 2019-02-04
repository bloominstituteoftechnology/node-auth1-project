const knex = require('knex')

const dbConfig = require('../../knexfile')
const db = knex(dbConfig.development)

module.exports = {
  register: (creds) => {
    return db('users').insert(creds)
  },

  login: (user_name) => {
    return db('users').where('user_name', user_name).first()
  },

  getUsers: () => {
    return db('users').select('id', 'user_name',)
  }
}