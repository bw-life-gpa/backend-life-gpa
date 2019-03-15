const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('../database/dbConfig');
const helper = require('../helpers/helpers');

const { authenticate } = require('../auth/authenticate');
const { generateToken } = require('../auth/tokenservice');

module.exports = server => {
  server.get('/', (req, res) => {
    res.status(200).send(`
      <div>
        <h2>Server Running Live...</h2>
        <p>Url to Login endpoint <strong>'/api/login'</strong></p>
        <p>Url to Register endpoint <strong>'/api/register'</strong></p>
      </div>`);
  });

  //****************************** ENDPOINTS *****************************/
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/users', authenticate, getUsers);
  server.get('/api/users/:id', authenticate, getUser);
  server.put('/api/users/:id', authenticate, updateUser);
  server.delete('/api/users/:id', authenticate, deleteUser);
  server.post('/api/habits', authenticate, createHabit);
  server.get('/api/habits', authenticate, getHabits);
  server.get('/api/habits/:id', authenticate, getHabit);
  server.get('/api/users/habits/:id', authenticate, getUserHabits);
  server.put('/api/habits/:id', authenticate, updateHabit);
  server.delete('/api/habits/:id', authenticate, deleteHabit);
  server.delete('/api/categories/:id', authenticate, deleteCategory);
  server.post('/api/categories', authenticate, createCategory);
  server.get('/api/categories', authenticate, getCategories);
  server.get('/api/categories/habits/:id', authenticate, getCategoryHabits);
  server.get('/api/users/categories/:id', authenticate, getUserCategories);
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
    return res.status(412).json({
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
              message: 'User registration Successful.',
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
          user,
          token,
        });
      } else {
        res.status(401).json({ message: 'Invalid Credentials, try again...' });
      }
    })
    .catch(err =>
      res.status(400).json({
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
            message: 'Your account update successful',
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

//************************* DELETE USER *************************/
function deleteUser(req, res) {
  const { id } = req.params;

  db('users');
  helper.deleteAllHabitsByUser(id).then(deleted => {
    res.status(200).json(deleted);
  });

  helper.deleteAllCategoriesByUser(id).then(deleted => {
    res.status(200).json(deleted);
  });
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
  const { habitTitle, categoryId } = req.body;
  const newHabit = {
    habitTitle,
    userId: req.decodedToken.subject,
    categoryId,
    completed: false,
    completionPoints: 0,
  };

  if (!habitTitle || !categoryId) {
    res.status(412).json({
      errorMessage: 'The habitTitle and categoryId are Required fields.',
    });
  }

  db('habits')
    .insert(newHabit)
    .then(ids => {
      const id = ids[0];

      db('habits')
        .where({ id })
        .first()
        .then(habit => {
          res
            .status(201)
            .json({
              message: 'Habit creation Successful.',
              habit,
            })
            .catch(err =>
              res.status(500).json({ errorMessage: 'Error creating Habit.' }),
            );
        })
        .catch(err =>
          res.status(500).json({ errorMessage: 'Habit could not be created.' }),
        );
    });
}

//******************** GET ALL HABITS ******************/
function getHabits(req, res) {
  db('habits')
    .where({ userId: req.decodedToken.subject })
    .then(habit => {
      res.json(habit);
    })
    .catch(err => res.send(err));
}

//******************** GET HABIT ******************/
function getHabit(req, res) {
  helper.getHabitById(req.params.id).then(resp => {
    res.json(resp[0]);
  });
}

//******************** GET USER HABITS ******************/
function getUserHabits(req, res) {
  db('users');
  helper
    .getUserById(req.params.id)
    .then(user => {
      if (user.length < 1) {
        res.status(404).json({
          errorMessage: `The user with the specified id: '${
            req.params.id
          }' does not exist.`,
        });
      } else {
        helper.getHabitsByUser(req.params.id).then(habits => {
          const userObj = user[0];
          userObj.habits = habits;
          res.status(200).json(user);
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
            message: 'Habit update successful',
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

//******************** DELETE HABIT ******************/
function deleteHabit(req, res) {
  const id = req.params.id;

  helper.getHabitById(id).then(body => {
    habit = body[0];

    if (!habit) {
      return res
        .status(404)
        .json({ errorMessage: `Habit with id: '${id}' does not exist.` });
    }

    if (habit.userId != req.decodedToken.subject) {
      return res
        .status(401)
        .json({ errorMessage: 'You are not authorized to delete this Habit.' });
    }
  });
  helper
    .deleteHabit(id)
    .then(deleted => {
      res.status(200).json({ message: 'Habit successfully deleted.' });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: `The Habit information could not be deleted.` });
    });
}

//******************** CREATE CATEGORY ******************/
function createCategory(req, res) {
  const { categoryTitle, color } = req.body;
  const category = { categoryTitle, color, userId: req.decodedToken.subject };

  if (!categoryTitle || !color) {
    res.status(412).json({
      errorMessage: 'The categoryTitle, color and userId are Required fields.',
    });
  }

  db('category')
    .insert(category)
    .then(ids => {
      const id = ids[0];

      db('category')
        .where({ id })
        .first()
        .then(categories => {
          res
            .status(201)
            .json({
              message: 'Category creation Successful.',
              categories,
            })
            .catch(err =>
              res
                .status(500)
                .json({ errorMessage: 'Error creating Category.' }),
            );
        })
        .catch(err =>
          res
            .status(500)
            .json({ errorMessage: 'Category could not be created.' }),
        );
    });
}

//******************** GET CATEGORIES ******************/
function getCategories(req, res) {
  db('category')
    .where({ userId: req.decodedToken.subject })
    .then(category => {
      res.json(category);
    })
    .catch(err => res.send(err));
}

//******************** GET USER CATEGORIES ******************/
function getUserCategories(req, res) {
  db('users');
  helper
    .getUserById(req.params.id)
    .then(user => {
      if (user.length < 1) {
        res.status(404).json({
          errorMessage: `The user with the specified id: '${
            req.params.id
          }' does not exist.`,
        });
      } else {
        helper.getCategoriesByUser(req.params.id).then(category => {
          const userObj = user[0];
          userObj.category = category;
          res.status(200).json(user);
        });
      }
    })
    .catch(() => {
      res.status(500).json({
        error: `The Specified user '${
          req.params.id
        }' category(ies) could not be retrieved.`,
      });
    });
}

//******************** GET CATEGORY HABITS ******************/
function getCategoryHabits(req, res) {
  db('category');
  helper
    .getCategoryById(req.params.id)
    .then(category => {
      if (category.length < 1) {
        res.status(404).json({
          errorMessage: `The category with the specified id: '${
            req.params.id
          }' does not exist.`,
        });
      } else {
        helper.getCategoryByHabits(req.params.id).then(habits => {
          const categoryObj = category[0];
          categoryObj.habits = habits;
          res.status(200).json(category);
        });
      }
    })
    .catch(() => {
      res.status(500).json({
        error: `The Specified Habit '${
          req.params.id
        }' habit(s) could not be retrieved.`,
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
            message: 'Category update successful',
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

//******************** DELETE CATEGORY ******************/
function deleteCategory(req, res) {
  const id = req.params.id;

  helper.getCategoryById(id).then(body => {
    category = body[0];

    if (!category) {
      return res
        .status(404)
        .json({ errorMessage: `Category with id: '${id}' does not exist.` });
    }

    if (category.userId != req.decodedToken.subject) {
      return res.status(401).json({
        errorMessage: 'You are not authorized to delete this Category.',
      });
    }
  });
  helper
    .deleteCategory(id)
    .then(deleted => {
      res.status(200).json({ message: 'Category successfully deleted.' });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: `The Category information could not be deleted.` });
    });
}
