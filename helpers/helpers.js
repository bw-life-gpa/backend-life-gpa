const db = require('../database/dbConfig');

module.exports = {
  addHabit,
  addCategory,
  removeUser,
  deleteHabit,
  getHabitById,
  deleteCategory,
  getUserById,
  getCategoryById,
  getHabitsByUser,
  getCategoriesByUser,
  getCategoryByHabits,
  deleteAllHabitsByUser,
  deleteAllCategoriesByUser,
};

//******************************** HELPER FUNCTIONS ***************/
function addHabit(habit) {
  return db('habits').insert(habit);
}

function addCategory(category) {
  return db('category').insert(category);
}

function removeUser(id) {
  return db('users')
    .where({ id })
    .del();
}

function getHabitById(id) {
  return db('habits').where({ id });
}

function getHabitsByUser(id) {
  return db('habits').where({ userId: id });
}

function getCategoriesByUser(id) {
  return db('category').where({ userId: id });
}

function getCategoryByHabits(id) {
  return db('habits').where({ categoryId: id });
}

function getUserById(id) {
  return db('users').where({ id });
}

function getCategoryById(id) {
  return db('category').where({ id });
}

function deleteHabit(id) {
  return db('habits')
    .where({ id })
    .del();
}

function deleteCategory(id) {
  return db('category')
    .where({ id })
    .del();
}

function deleteAllHabitsByUser(id) {
  return db('habits')
    .where({ userId: id })
    .del();
}

function deleteAllCategoriesByUser(id) {
  return db('category')
    .where({ userId: id })
    .del();
}
