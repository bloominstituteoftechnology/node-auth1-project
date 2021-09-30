const db = require('../../data/db-config');

function find() {
  return db('users') // table
    .select('user_id', 'username') //select user_id, username
    .orderBy('user_id'); //from users
}

function findBy(filter) {
  return db('users') //table  
    .select('*')//select *
    .where(filter) //where user_id=filter inputted
    .orderBy('user_id'); //order by user_id
}

function findById(user_id) {
  return db('users') //table 
    .select('user_id', 'username')
    .where('user_id', user_id) //where user_id=user_id inputted
    .first(); //the first one
}

async function add(user) {
  const [user_id] = await db('users').insert(user, 'user_id');
  return findById(user_id);
}

module.exports = {
  find,
  findBy,
  findById,
  add
};
