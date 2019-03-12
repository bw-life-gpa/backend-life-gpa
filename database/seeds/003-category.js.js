exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('category')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('category').insert([
        { categoryTitle: 'Physical Fitness', color: 'red', habitId: 1 },
      ]);
    });
};
