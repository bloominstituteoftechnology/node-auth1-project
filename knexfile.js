module.exports = {
	development: {
		client: 'sqlite3',
		connection: {
			filename: './data/auth.sqlite3'
		},
		useNullAsDefault: true,
		migration: {
			directory: './data/migrations',
			tableName: 'dbmigrations'
		},
		seeds: {
			directory: './data/seeds'
		}
	}
};
