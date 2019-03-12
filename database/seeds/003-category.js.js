exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('category')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('category').insert([
        { categoryTitle: 'Physical Fitness', color: 'red', habitId: 1 },
        { categoryTitle: 'Resistance Training', color: 'blue', habitId: 2 },
        { categoryTitle: 'Physical Endurance', color: 'red', habitId: 1 },
        { categoryTitle: 'Crossfit Training', color: 'blue', habitId: 2 },
      ]);
    });
};
