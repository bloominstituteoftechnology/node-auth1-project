const db = require("../data/db-config");

module.exports = {
  findUser
};

function findUser(userName) {
  // select * from users where username = 'sam';
  return db("users")
    .where({ userName: userName })
    .first();
}