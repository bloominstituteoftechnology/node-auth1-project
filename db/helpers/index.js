const knex = require("knex");
const dbConfig = require("../../knexfile");

const db = knex(dbConfig.development);

module.exports = {
  // We are not doing a lot of endpoints it doesn't sound like
  // but I want to be in the habbit of creating my functions here.
  hashUser: function(action) {
    let query = db("users");

    return query.insert(action).then(id => id);
  },

  verifyUser: function(creds) {
    let query = db("users");

    return query
      .where({ username: creds.username })
      .first()
      .then(user => user);
  },

  get: function(id) {
    let query = db("users");

    if (id) {
      return query
        .where("id", id)
        .first()
        .then(user => user);
    } else {
      return query.select("id", "username").then(users => users);
    }
  }
};
