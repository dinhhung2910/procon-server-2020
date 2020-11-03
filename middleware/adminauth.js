const jwt = require('jsonwebtoken');
const config = require('config');
const adminJwtSecret = config.get('adminJwtSecret');

/**
 * Strict auth
 * User MUST be Activated
 * @param {*} req req
 * @param {*} res res
 * @param {*} next next
 * @return {*}
 */
module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if not token
  if (!token) {
    return res.status(401).json({msg: 'No token, authorization.'});
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, adminJwtSecret);

    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({msg: 'Token is not valid'});
  }
};
