const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = server => {
  server.get('/', (req, res) => {
    res.send(
      `\n\t\t=== It's alive! ===\n=== Login endpoint '/api/login' ===\n=== Register endpoint '/api/register' ===`,
    );
  });
};
