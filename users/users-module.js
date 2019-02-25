const db = require('../data/dbConfig.js');

module.exports = {
  addUser,
  findUserBy,
  getUsers,
}

async function addUser(userData) {
  try {
    const [id] = await db('users').insert(userData);
    // console.log(id);
    return id;    
  } catch (error) {
    // console.log("error: ", error);
    throw error;
  }
};

async function findUserBy(filter) {
  try {
    const userData = await db('users')
      .where(filter)
      .first();
    return userData;
  } catch (error) {
    throw error;
  }
};

async function getUsers() {
  try {
    const usersData = await db('users');
    return usersData;
  } catch (error) {
    throw error;
  }
}