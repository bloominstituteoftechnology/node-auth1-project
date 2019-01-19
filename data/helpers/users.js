const DB = require("../dbConfig");

module.exports = {
  getUsers: () => {
    return DB("users").select("id", "username", "emails");
  }
};
