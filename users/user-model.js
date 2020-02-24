const db = require('../database/dbConfig.js')

module.exports = {
    add,
    findById,
    find,
    findBy,

}

function findBy(username){
    return db('users').select("username","password").where({username})

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
      .select('id', 'username')
      .where({ id })
      .first();
  }

  function find() {
    return db("users").select("id", "username", "password");
  }