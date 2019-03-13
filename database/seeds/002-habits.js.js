exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('habits')
    .truncate()
    .then(function() {
      // Inserts seed entries
      return knex('habits').insert([
        {
          habitTitle: 'Run 10 miles',
          completed: false,
          completionPoints: 0,
          userId: 1,
          categoryId: 1,
          created_at: knex.fn.now(),
        },
        {
          habitTitle: 'Lift 200lbs',
          completed: false,
          completionPoints: 0,
          userId: 1,
          categoryId: 2,
          created_at: knex.fn.now(),
        },
        {
          habitTitle: 'Lift 200lbs',
          completed: false,
          completionPoints: 0,
          userId: 2,
          categoryId: 2,
          created_at: knex.fn.now(),
        },
        {
          habitTitle: 'Lift 200lbs',
          completed: false,
          completionPoints: 0,
          userId: 3,
          categoryId: 2,
          created_at: knex.fn.now(),
        },
      ]);
    });
};
