const knex = require('knex');
const knexConfig = require('../knexfile.js');
const db = knex(knexConfig.development);


 /* module.exports = {
    insert: (user) => {
        return db('users').insert(user);
    },

    findByUsername: (username) => {
        return db('users').where('username', username)

    }
};  */

 module.exports = {
    find,
    findByUsername,
    insert,
    update,
    remove,
  };
  
  function find() {
    return db('users');
  }
  
  function findByUsername(username) {
    return db('users').where({ 'username': username });
  }
  
  function insert(user) {
      console.log("user", user)
    return db('users')
      .insert(user)
      .then(ids => ({ id: ids[0] }));
  }
  
  function update(id, post) {
    return db('posts')
      .where('id', Number(id))
      .update(post);
  }
  
  function remove(id) {
    return db('posts')
      .where('id', Number(id))
      .del();
  } 
  
/******************************************************* */

  