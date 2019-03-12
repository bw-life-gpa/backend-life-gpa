exports.up = function(knex) {
  return knex.schema.createTable('users', tbl => {
    tbl.increments();

    tbl
      .string('username', 255)
      .notNullable()
      .unique();
    tbl.string('password', 255).notNullable();
    tbl.string('fullName', 255).notNullable();
    tbl.string('email');
    tbl.string('userImgUrl');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users');
};
