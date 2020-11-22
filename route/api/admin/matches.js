const express = require('express');
const adminauth = require('../../../middleware/adminauth');
const router = express.Router();
const logger = require('../../../logger/winston');
const {generateMap} = require('../../../utils/generateMap');
const Match = require('../../../models/match');
const Team = require('../../../models/team');
const {MatchStatus} = require('../../../utils/constants');
const {startGame} = require('../../../utils/game');

/**
 * @route GET /api/admin/matches
 * @desc Get basic information of all matches
 * @access authenticated
 */
router.get('/', [adminauth], async (req, res) => {
  try {
    const matches = await Match.find().
      select([
        '-actions',
        '-stagingMoves',
        '-obstacles',
        '-points',
        '-teams',
        '-tiled',
        '-treasure',
      ]);
    matches.sort((a, b) => {
      return (b.code - a.code);
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
    const match = await Match.findOne({
      code: req.params.code,
    }).lean();

    if (!match) {
      res.status(404).send('Match not found');
    } else {
      const current = new Date();
      const currentStatus = Match.prototype.getCurrentStatus.bind(match)();
      switch (currentStatus) {
      case MatchStatus.EARLY: {
        match.status = {
          type: 'early',
          remaining: match.startedAtUnixTime - current,
        };
        break;
      }
      case MatchStatus.ENDED: {
        match.status = {
          type: 'ended',
          remaining: 0,
        };
        break;
      }
      case MatchStatus.INTERVAL: {
        match.status = {
          type: 'interval',
          remaining: (match.intervalMillis + match.turnMillis) -
          (current - match.startedAtUnixTime) %
          (match.intervalMillis + match.turnMillis),
        };
        break;
      }
      case MatchStatus.TURN: {
        match.status = {
          type: 'turn',
          remaining: (match.turnMillis) -
          (current - match.startedAtUnixTime) %
          (match.intervalMillis + match.turnMillis),
        };
        break;
      }
      default: {
        match.status = {
          type: 'error',
          remaining: -1,
        };
        break;
      }
      }

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
      intervalMillis,
      turnMillis,
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
    match.turnMillis = turnMillis;
    match.intervalMillis = intervalMillis;

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

    startGame(match._id);

    res.json(match);
  } catch (e) {
    logger.error(e);
    res.status(500).send('Server error');
  }
});

module.exports = router;
