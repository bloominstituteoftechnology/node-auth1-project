//? s25 create model creat dbConfig.js file
const db = require('../database/dbConfig.js')

//? s27
function find() {
    return db('users').select('id', 'username');
  }
  
//? s28
  function findBy(filter) {
    return db('users')
    // ? s4 add password
      .select('id', 'username', 'password')
      .where(filter);
  }

//? s29 
  function add(user) {
    return db('users')
      .insert(user, 'id')
      .then(ids => {
        const [id] = ids;
        return findById(id);
      });
  }
  
//? 30
  function findById(id) {
    return db('users')
      .select('id', 'username')
      .where({ id })
      .first();
  }

//? s26
module.exports = {
    add, 
    find, 
    findBy, 
    findById,
};