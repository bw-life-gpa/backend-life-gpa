const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('../database/dbConfig');
const helper = require('../helpers/helpers');

const { authenticate } = require('../auth/authenticate');
const { generateToken } = require('../auth/tokenService');

module.exports = server => {
  server.get('/', (req, res) => {
    res.send(
      `\n\t\t=== It's alive! ===\n=== Login endpoint '/api/login' ===\n=== Register endpoint '/api/register' ===`,
    );
  });
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/users', authenticate, getUsers);
  server.get('/api/users/:id', authenticate, getUser);
  server.put('/api/users/:id', authenticate, updateUser);
  server.delete('/api/users/:id', authenticate, deleteUser);
  server.post('/api/habits', authenticate, createHabit); //--****-- NEED TO FIX/BROKEN --****---/
  server.get('/api/habits', authenticate, getHabits);
  server.get('/api/habits/:id', authenticate, getHabit);
  server.get('/api/users/habits/:id', authenticate, getUserHabits);
  server.put('/api/habits/:id', authenticate, updateHabit);
  //server.delete('/api/habits/:id', deleteHabit);
  server.get('/api/categories', authenticate, getCategories);
  server.get('/api/categories/habits/:id', authenticate, getCategoryHabits);
  server.put('/api/categories/:id', authenticate, updateCategory);
};

//******************** REGISTER NEW USER ******************/
function register(req, res) {
  const { username, password, fullName, email, userImgUrl } = req.body;
  const creds = { username, password, fullName, email, userImgUrl };
  const hash = bcrypt.hashSync(creds.password, 10);
  creds.password = hash;

  if (!creds.userImgUrl) {
    creds.userImgUrl =
      'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
  }
  if (!username || !password || !fullName || !email) {
    return res.status(400).json({
      errorMessage: `One or more inputs missing, username, password, fullName and email are Required fields.`,
    });
  }

  db('users')
    .insert(creds)
    .then(ids => {
      const id = ids[0];

      db('users')
        .where({ id })
        .first()
        .then(user => {
          res
            .status(201)
            .json({
              id: user.id,
              message: 'User registration Sucessful.',
            })
            .catch(err =>
              res.status(500).json({ message: 'Unable to register new User.' }),
            );
        })
        .catch(err =>
          res.status(500).json({ message: 'Error registering User.' }),
        );
    });
}

//******************** LOGIN USER ******************/
function login(req, res) {
  const { username, password } = req.body;
  const creds = { username, password };

  db('users')
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        const token = generateToken(user);

        res.status(200).json({
          message: `Welcome ${user.username}! Token registered...`,
          token,
        });
      } else {
        res.status(401).json({ message: 'Invalid Credentials, try again...' });
      }
    })
    .catch(err =>
      res.status(500).json({
        message: 'No valid user credentials provided, please register...',
      }),
    );
}

//******************** GET ALL USERS ******************/
function getUsers(req, res) {
  db('users')
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
}

//******************** GET USER ******************/
function getUser(req, res) {
  db('users')
    .where({ id: req.params.id })
    .then(users => {
      if (users.length > 0) {
        res.status(200).json(users);
      } else {
        res.status(404).json({
          errorMessage: `The user with the specified id: ${
            req.params.id
          } does not exist.`,
        });
      }
    })
    .catch(err => {
      res.status(500).json({ error: 'Server cannot retrieve User.' });
    });
}

//************************** UPDATE USER *************************/
function updateUser(req, res) {
  const changes = req.body;
  db('users')
    .where({ id: req.params.id })
    .update(changes)
    .then(didUpdate => {
      didUpdate
        ? res.status(200).json({
            message: 'Your account update sucessfull',
            updated: changes,
          })
        : res.status(404).json({
            error: `The user with the specified id: ${
              req.params.id
            } does not exist.`,
          });
    })
    .catch(err => {
      res.status(500).json({ error: `The User information was not modified.` });
    });
}

//************************** DELETE USER *************************/
function deleteUser(req, res) {
  const { id } = req.params;

  db('users');
  helper
    .removeUser(id)
    .then(deleted => {
      if (!deleted) {
        res.status(404).json({
          message: `User with specified id: ${req.params.id} not found.`,
        });
      } else {
        res.status(200).json({ message: 'User Deleted!', deleted });
      }
    })
    .catch(err => res.status(500).json(err));
}

//******************** CREATE HABIT ******************/
function createHabit(req, res) {
  const { habitTitle, completed } = req.body;
  const newHabit = { habitTitle, completed };

  if (!habitTitle) {
    return res.status(417).json({
      error: 'A habitTitle is REQUIRED to create a new habit.',
    });
  }
  db('habits');
  helper
    .add(newHabit)
    .then(ids => {
      res.status(201).json({ newHabit, message: 'Habit added sucessfully' });
    })
    .catch(err => {
      res.status(500).json({ error: 'The habit could not be saved.' });
    });
}

//******************** GET ALL HABITS ******************/
function getHabits(req, res) {
  db('habits')
    .then(habit => {
      res.json(habit);
    })
    .catch(err => res.send(err));
}

//******************** GET HABIT ******************/
function getHabit(req, res) {
  db('habits')
    .where({ id: req.params.id })
    .then(habit => {
      if (habit.length > 0) {
        res.status(200).json(habit);
      } else {
        res.status(404).json({
          errorMessage: `The habit with the specified id: ${
            req.params.id
          } does not exist.`,
        });
      }
    })
    .catch(err => {
      res.status(500).json({ error: 'Server cannot retrieve Habit.' });
    });
}

//******************** GET USER HABITS ******************/
function getUserHabits(req, res) {
  db('users');
  helper
    .getHabitsByUser(req.params.id)
    .then(habit => {
      if (habit) {
        res.json(habit);
      } else {
        res.status(404).json({
          errorMessage: `The user with the specified ID '${
            req.params.id
          }' does not exist.`,
        });
      }
    })
    .catch(() => {
      res.status(500).json({
        error: `The Specified user '${
          req.params.id
        }' habit(s) could not be retrieved.`,
      });
    });
}

//******************** UPDATE HABIT ******************/
function updateHabit(req, res) {
  const changes = req.body;

  db('habits')
    .where({ id: req.params.id })
    .update(changes)
    .then(count => {
      count
        ? res.status(200).json({
            message: 'Habit update sucessfull',
            updated: changes,
          })
        : res
            .status(404)
            .json({ error: 'The Habit with the specified ID does not exist.' });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: `The Habit information could not be modified.` });
    });
}

//******************** GET CATEGORIES ******************/
function getCategories(req, res) {
  db('category')
    .then(category => {
      res.json(category);
    })
    .catch(err => res.send(err));
}

//******************** GET HABIT CATEGORIES ******************/
function getCategoryHabits(req, res) {
  db('habits');
  helper
    .getCategoryByHabits(req.params.id)
    .then(category => {
      if (category.length > 0) {
        res.json(category);
      } else {
        res.status(404).json({
          errorMessage: `The Habit with the specified ID '${
            req.params.id
          }' does not exist.`,
        });
      }
    })
    .catch(() => {
      res.status(500).json({
        error: `The specified Habit '${
          req.params.id
        }' category(ies) could not be retrieved.`,
      });
    });
}

//******************** UPDATE CATEGORY ******************/
function updateCategory(req, res) {
  const changes = req.body;

  db('category')
    .where({ id: req.params.id })
    .update(changes)
    .then(count => {
      count
        ? res.status(200).json({
            message: 'Category update sucessfull',
            updated: changes,
          })
        : res.status(404).json({
            error: `The Category with the specified ID: ${
              req.params.id
            } does not exist.`,
          });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: `The Category information could not be modified.` });
    });
}
