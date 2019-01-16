exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("users")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("users").insert([
        {
          username: "joseph",
          emails: "['admin@joseph.josephmt.com','joseph@josephmt.com']",
          password:
            "$2a$14$Yfb/25Io3edfeLhP9uTov.m59WgWsaGzW7DvBWfON/SeEWpp5xrTK"
        },
        {
          username: "admin",
          emails: "['admin@thompsoncodesign.com','joseph@josephmt.com']",
          password:
            "$2a$14$Yfb/25Io3edfeLhP9uTov.m59WgWsaGzW7DvBWfON/SeEWpp5xrTK"
        }
      ]);
    });
};
