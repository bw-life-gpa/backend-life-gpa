exports.up = function(knex) {
  return knex.schema.createTable('category', tbl => {
    tbl.increments();

    tbl
      .string('categoryTitle', 255)
      .notNullable()
      .unique();
    tbl.string('color');
    tbl
      .integer('habitId')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('habit');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('category');
};
