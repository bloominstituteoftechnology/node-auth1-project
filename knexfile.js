require("dotenv").config();

			const pgConnection = process.env.DATABASE_URL || "postgresql://postgres@localhost/auth";
			// if using a local postgres server, please create the database manually, Knex will not create it autmatically

		module.exports = {
  			development: {
			    client: "sqlite3",
			    useNullAsDefault: true,
			    connection: {
			      filename: "./database/auth.db3",			//	<---- this will change depending on what project you are creating
			    },
			    pool: {
			      afterCreate: (conn, done) => {
			        conn.run("PRAGMA foreign_keys = ON", done);

				/*  
				  The code above is running a SQL command that makes sense to SQLite
			          it is going to tell SQLite that we intend for foreign key constraints
			          to be active

			          this is the enforcement of foreign keys 
			        */ 
			      },
			    },
			    migrations: {
			      directory: "./database/migrations",
			    },
			    seeds: {
			      directory: "./database/seeds",
			    },
			  },

			  production: {
			    client: "pg",
			    connection: pgConnection,
			    pool: {
			      min: 2,
			      max: 10,
			    },
			    migrations: {
			      directory: "./database/migrations",
			    },
			    seeds: {
			      directory: "./database/seeds",
			    },
			  },
			};

