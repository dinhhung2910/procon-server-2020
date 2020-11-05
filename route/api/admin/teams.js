const express = require('express');
const adminauth = require('../../../middleware/adminauth');
const Team = require('../../../models/team');
const logger = require('../../../logger/winston');

const jwt = require('jsonwebtoken');
const config = require('config');
const token = config.get('jwtSecret');

const router = express.Router();

/**
 * @route POST /api/admin/team
 * @desc create new team
 */
router.post('/', [adminauth], async (req, res) => {
  try {
    const {name, school, username, password} = req.body;
    const team = new Team();
    team.name = name;
    team.school = school;
    team.username = username;
    team.password = password;
    const teamCounted = await Team.countDocuments({});

    team.code = teamCounted + 1;

    await team.save();
    res.json('ok');
  } catch (e) {
    res.status(500).send('server error');
    console.error(e);
    logger.error(e);
  }
});

/**
 * @route GET /api/admin/team
 * @desc Get all team
 */
router.get('/', [adminauth], async (req, res) => {
  try {
    const teams = await Team.find({});
    res.json(teams);
  } catch (e) {
    res.status(500).send('server error');
    console.error(e);
    logger.error(e);
  }
});

/**
 * @route GET /api/admin/team/:code
 * @desc Get team info
 */
router.get('/:code', [adminauth], async (req, res) => {
  try {
    const team = await Team.findOne({
      code: req.params.code,
    });
    if (!team) {
      res.status(404).send('Team not found');
    }
    res.json(team);
  } catch (e) {
    res.status(500).send('server error');
    console.error(e);
    logger.error(e);
  }
});

/**
 * @route GET /api/admin/team/:code/token
 * @desc Get team token
 */
router.get('/:teamCode/token', [adminauth], async (req, res) => {
  try {
    const teamCode = req.params.teamCode;
    const team = await Team.findOne({
      code: teamCode,
    });

    if (!team) {
      return res.status(404).send('Team not found');
    }

    const payload = {
      user: {
        id: team._id,
      },
    };
    jwt.sign(
      payload,
      token,
      {expiresIn: 360000},
      (err, token) => {
        if (err) throw err;
        res.json({token});
      },
    );
  } catch (e) {
    res.status(500).send('server error');
    console.error(e);
    logger.error(e);
  }
});

module.exports = router;
