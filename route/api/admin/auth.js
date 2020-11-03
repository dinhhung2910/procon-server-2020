const express = require('express');
const router = express.Router();
const {validationResult, check} = require('express-validator');

const config = require('config');
const jwt = require('jsonwebtoken');
const logger = require('../../../logger/winston');

const adminAuth = require('../../../middleware/adminauth');

const adminUsername = config.get('adminUsername');
const adminPassword = config.get('adminPassword');
const adminId = config.get('adminId');
const adminJwtSecret = config.get('adminJwtSecret');

// @route   POST api/admin/auth/
// @desc    Log admin user in
// @access  Public
router.post(
  '/',
  [
    check('username', 'Username is required').exists(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }

    const {username, password} = req.body;

    try {
      if (username != adminUsername || password != adminPassword) {
        return res.status(400).json({
          errors: [
            {
              msg: 'Invalid credentials',
              param: '',
            },
          ],
        });
      }

      // Return jsonwebtoken
      const payload = {
        user: {
          id: adminId,
        },
      };
      jwt.sign(
        payload,
        adminJwtSecret,
        {expiresIn: 360000},
        (err, token) => {
          if (err) throw err;
          res.json({token});
        },
      );
    } catch (e) {
      // Something went wrong
      logger.error(e);
      res.status(500).send('Server error');
    }
  },
);

router.get('/', [adminAuth], async (req, res) => {
  try {
    const user = {
      username: adminUsername,
      name: 'Admin',
      _id: adminId,
    };

    res.json(user);
  } catch (e) {
    console.log(e.message);
    res.status(500).send('Server error');
    logger.error(e);
  }
});

module.exports = router;
