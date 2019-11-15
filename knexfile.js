// Update with your config settings.

module.exports = {
  development: {
    client: "sqlite3",
    connection: {
      filename: "./authenticate.sqlite3"
    },
    migrations:{},
    seeds:{}
  }
};
