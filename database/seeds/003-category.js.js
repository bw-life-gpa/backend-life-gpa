exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('category')
    .truncate()
    .then(function() {
      // Inserts seed entries
      return knex('category').insert([
        { categoryTitle: 'Physical Fitness', color: 'red', userId: 1 },
        { categoryTitle: 'Resistance Training', color: 'blue', userId: 2 },
        { categoryTitle: 'Physical Endurance', color: 'red', userId: 1 },
        { categoryTitle: 'Crossfit Training', color: 'blue', userId: 2 },
      ]);
    });
};
