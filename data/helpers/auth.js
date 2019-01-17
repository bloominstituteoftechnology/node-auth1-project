const DB = require("../dbConfig");

module.exports = {
  loginUser: () => {},
  registerUser: user => {
    return DB("users").insert(user);
  },
  getUsers: () => {
    return DB("users");
  },
  getUser: id => {
    return DB("users")
      .where("id", id)
      .select("username", "emails");
  },
  checkForUniqueUser: username => {
    return DB("users").where("username", username);
  }
};
