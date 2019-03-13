exports.up = function(knex) {
  return knex.schema.createTable('category', tbl => {
    tbl.increments();

    tbl
      .string('categoryTitle', 255)
      .notNullable()
      .unique();
    tbl.string('color');
    tbl
      .integer('userId')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('category');
};
