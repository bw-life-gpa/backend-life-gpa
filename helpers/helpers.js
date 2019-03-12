const db = require('../database/dbConfig');

module.exports = {
  add,
  removeUser,
  getHabitsByUser,
  getCategoryByHabits,
};

//******************************** HELPER FUNCTIONS ***************/
function add(habit) {
  return db('habits')
    .insert(habit)
    .into('habits');
}

function removeUser(id) {
  return db('users')
    .where({ id })
    .del();
}
function getHabitsByUser(userId) {
  return db('habits').where('userId', userId);
}

function getCategoryByHabits(habitId) {
  return db('category').where('habitId', habitId);
}
