module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './database/auth.sqlite3'
    },
    useNullAsDefault: true, // used to avoid warning on console
  }
};
