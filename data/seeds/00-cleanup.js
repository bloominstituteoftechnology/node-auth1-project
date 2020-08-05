const cleaner = require("knex-cleaner");

exports.seed = function(knex) {
  return cleaner
          .clean(knex, {
            mode: "truncate",
            restartIdentity: true, // reset Primary Keys to 0 on PostgreSQL
            ignoreTables: ["knex_migrations", "knex_migrations_lock"],
          })
          .then(() => console.log("\n** Tables truncated, ready to seed **\n"));
};
