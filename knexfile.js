// Update with your config settings.

module.exports = {
	client: "sqlite3",
	useNullAsDefault: true,
	connection: {
		filename: "./database/auth.db3",
	},
	migrations: {
		directory: "./migrations",
	},
	seeds: {
		directory: "./database/seeds",
	},
	pool: {
		afterCreate: (conn, done) => {
			conn.run("PRAGMA foreign_keys = ON", done)
		},
	},
}

  