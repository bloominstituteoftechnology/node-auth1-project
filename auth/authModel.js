const data = require("../data/config");
const bcrypt = require("bcryptjs");

async function createUser(user) {
  user.password = await bcrypt.hashSync(user.password, 8);
  return data.insert(user).into("accounts");
}

function findByName(user_name) {
  return data("accounts")
    .select("id", "user_name", "password")
    .where("user_name", user_name)
    .first();
}

module.exports = { createUser, findByName};
