module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './data/users.db3',
    },
    useNullAsDefault: true,
  },
};
