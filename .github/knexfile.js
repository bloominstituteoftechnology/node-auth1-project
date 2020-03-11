module.exports = {
   development: {
     client: "sqlite3",
     useNullAsDefault: true,
     connection: {
       filename: "./database/auth.db3"
     },
     pool: {
       afterCreate: (conn, done) => {
         conn.run("PRAGMA foreign_keys = ON", done); // <-- enforce foreign keys 🔑
       }
     },
     migrations: {
       directory: "./database/migrations" // <-- migrations directory
     },  
   }
 };