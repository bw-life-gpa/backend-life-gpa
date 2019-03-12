const jwt = require('jsonwebtoken');
const secret = require('../_secrets').jwtSecret;

module.exports = {
  generateToken,
};

//************ GENERATE TOKEN ***************/
function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };

  const options = {
    expiresIn: '1d',
  };

  return jwt.sign(payload, secret, options);
}
