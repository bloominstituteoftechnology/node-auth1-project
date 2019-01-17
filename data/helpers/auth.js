const DB = require("../dbConfig");

module.exports = {
  loginUser: username => {
    return DB("users")
      .where("username", username)
      .first();
  },
  registerUser: user => {
    return DB("users").insert(user);
  },
  getUser: id => {
    return DB("users")
      .where("id", id)
      .select("username", "emails")
      .first();
  },
  checkForUniqueUser: username => {
    return DB("users").where("username", username);
  }
};
