exports.up = function (knex) {
  return (
    knex.schema
      //roles either instructor or student
      .createTable("roles", (tbl) => {
        tbl.increments();
        tbl.string("role", 128).notNull();
      })
      //users
      .createTable("users", (tbl) => {
        tbl.increments();
        tbl.string("username", 128).notNull().unique();
        tbl.string("password", 128).notNull();
        tbl.string("email", 128).notNull().unique();
        tbl
          .integer("role_id") // student or instructor
          .unsigned()
          .notNull()
          .references("roles.id") // || .inTable("roles")
          .onDelete("CASCADE")
          .onUpdate("CASCADE");
      })
      //tasks /api/users/:id/tasks ----->
      .createTable("tasks", (tbl) => {
        tbl.increments("id");
        tbl.string("notes", 300).notNull();
        tbl
          .integer("user_id")
          .unsigned()
          .notNullable()
          .references("users.id")
          .onDelete("CASCADE")
          .onUpdate("CASCADE");
      })
      //location //api/users/:id/locations
      .createTable("locations", (tbl) => {
        tbl.increments();
        tbl.string("city", 128).notNull();
        tbl.string("age", 128).notNull();
        //students have false powers - instructors = true
        tbl.boolean("powers", 128).notNull().defaultTo(false);
        tbl.timestamps(true, true); // no need to request from body
      })
      //user locations
      .createTable("user_location", (tbl) => {
        tbl
          .integer("user_id")
          .unsigned()
          .notNull()
          .references("users.id") // ||.inTable("users")
          .onDelete("CASCADE")
          .onUpdate("CASCADE");
        tbl
          .integer("location_id")
          .unsigned()
          .notNull()
          .references("locations.id") // ||.inTable("classes")
          .onDelete("CASCADE")
          .onUpdate("CASCADE");
        tbl.primary(["user_id", "location_id"]);
      })
  );
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("user_location")
    .dropTableIfExists("locations")
    .dropTableIfExists("tasks")
    .dropTableIfExists("users")
    .dropTableIfExists("roles");
};
