const express = require('express');
const adminauth = require('../../../middleware/adminauth');
const router = express.Router();
const logger = require('../../../logger/winston');
const {generateMap} = require('../../../utils/generateMap');
const Match = require('../../../models/match');
const Team = require('../../../models/team');

/**
 * @route GET /api/admin/matches
 * @desc Get basic information of all matches
 * @access authenticated
 */
router.get('/', [adminauth], async (req, res) => {
  try {
    const matches = await Match.find();
    matches.sort((a, b) => {
      return (a.code - b.code);
    });
    res.json(matches);
  } catch (e) {
    console.error(e);
    logger.error(e);
    res.status(500).send('Server error');
  }
});

/**
 * @route GET /api/admin/matches/:code
 * @desc Get information of a match
 * @access authenticated
 */
router.get('/:code', [adminauth], async (req, res) => {
  try {
    const match = await Match.find({
      code: req.params.code,
    });
    if (!match) {
      res.status(404).send('Match not found');
    } else {
      res.json(match);
    }
  } catch (e) {
    console.error(e);
    logger.error(e);
    res.status(500).send('Server error');
  }
});

/**
 * @route POST /api/admin/matches
 * @desc Create random map with 2 team
 * @access authenticated
 */
router.post('/', [adminauth], async (req, res) => {
  try {
    const {
      width,
      height,
      startAt,
      redTeamCode,
      blueTeamCode,
    } = req.body;

    const resT = await generateMap(width, height);
    const match = new Match();

    const redTeam = await Team.findOne({code: redTeamCode});
    if (!redTeam) {
      return res.status(404).send('Red team not found');
    }
    const blueTeam = await Team.findOne({code: blueTeamCode});
    if (!blueTeam) {
      return res.status(404).send('Blue team not found');
    }

    // assign team
    match.redTeamCode = redTeam.code;
    match.redTeamName = redTeam.name;
    match.blueTeamCode = blueTeam.code;
    match.blueTeamName = blueTeam.name;

    match.startedAtUnixTime = new Date(startAt);

    // match detail
    match.agentsNum = resT.agentsNum;
    match.width = width;
    match.height = height;
    match.maxTurn = resT.turns;

    match.teams.push({
      teamID: redTeamCode,
      agents: resT.teamA.agents,
    });
    match.teams.push({
      teamID: blueTeamCode,
      agents: resT.teamB.agents,
    });

    match.points = resT.points;
    match.tiled = resT.tiled;
    match.obstacles = resT.walls;
    match.treasure = resT.treasures;

    match.code = await Match.countDocuments({}) + 1;
    await match.save();

    setTimeout(() => {
      match.turn = 1;
      match.save();
    }, 5000);

    res.json(match);
  } catch (e) {
    logger.error(e);
    res.status(500).send('Server error');
  }
});

module.exports = router;
