const data = require("../data/config");
const bcrypt = require("bcryptjs");

async function createUser(user) {
  user.password = await bcrypt.hash(user.password, 8);
  return data.insert(user).into("accounts");
}

module.exports = { createUser };
