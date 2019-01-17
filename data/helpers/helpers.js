const knex = require('knex');
const dbConfig = require('../../knexfile');

const db=knex(dbConfig.development);

module.exports={
  addUser: (user)=>{
      return db('users').insert(user);
  },

  login: (userName)=>{
    return db('users').where('username', userName);
  }
}