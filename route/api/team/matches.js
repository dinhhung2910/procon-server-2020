const express = require('express');
const router = express.Router();
const logger = require('../../../logger/winston');
const Match = require('../../../models/match');
const Team = require('../../../models/team');
const teamauth = require('../../../middleware/teamauth');
const {validateMoves} = require('../../../utils/game');
const {MatchStatus} = require('../../../utils/constants');

/**
 * @route GET matches
 * @desc Get team's involved matches
 * @access authenticated
 */
router.get('/', [teamauth], async (req, res) => {
  try {
    const team = await Team.findById(req.user.id);
    if (!team) {
      return res.status(401).send({
        status: 'InvalidToken',
      });
    }
    const matches = await Match.find({
      $or: [
        {blueTeamCode: team.code},
        {redTeamCode: team.code},
      ],
    });
    const result = [];
    matches.forEach((match) => {
      result.push({
        id: match.code,
        intervalMillis: match.intervalMillis || 15000,
        matchTo: match.blueTeamCode == team.code ?
          match.redTeamName :
          match.blueTeamName,
        teamID: team.code,
        turnMillis: match.turnMillis || 15000,
        turns: match.maxTurn,
      });
    });

    res.json(result);
  } catch (e) {
    logger.error(e);
    res.status(500).send('Server error');
  }
});

/**
 * @route GET /matches/:id
 * @desc Get match detail
 * @access Authenticated
 */
router.get('/:code', [teamauth], async (req, res) => {
  try {
    const team = await Team.findById(req.user.id);
    if (!team) {
      return res.status(401).send({
        status: 'InvalidToken',
      });
    }
    const match = await Match.findOne({
      code: req.params.code,
    });
    validateMoves(match._id);
    if (!match) {
      return res.status(400).send({
        status: 'InvalidMatches',
      });
    }
    if (match.blueTeamCode != team.code && match.redTeamCode != team.code) {
      return res.status(400).send({status: 'InvalidMatches'});
    }
    if (new Date() < match.startedAtUnixTime) {
      return res.status(400).send({status: 'TooEarly'});
    }

    let result = {};

    result = {
      width: match.width,
      height: match.height,
      points: match.points,
      startedAtUnixTime: match.startedAtUnixTime.getTime(),
      turn: match.turn,
      tiled: match.tiled,
      teams: match.teams,
      actions: match.actions,
      obstacles: match.obstacles,
      treasure: match.treasure,
    };

    res.json(result);
  } catch (e) {
    logger.error(e);
    console.error(e);
    res.status(500).send('Server error');
  }
});


/**
 * @route POST /matches/:code/action
 * @desc Update action
 * @access Authenticated
 */
router.post('/:code/action', [teamauth], async (req, res) => {
  try {
    const team = await Team.findById(req.user.id);

    if (!team) {
      return res.status(401).send({
        status: 'InvalidToken',
      });
    }
    const match = await Match.findOne({
      code: req.params.code,
    });
    if (!match) {
      return res.status(400).send({
        status: 'InvalidMatches',
      });
    }
    if (match.blueTeamCode != team.code && match.redTeamCode != team.code) {
      return res.status(400).send({status: 'InvalidMatches'});
    }

    const matchStatus = match.getCurrentStatus();

    switch (matchStatus) {
    case MatchStatus.EARLY:
      return res.status(400).send({status: 'TooEarly'});
    case MatchStatus.ENDED:
      console.log('Too late!');
      return res.status(400).send({status: 'UnacceptableTime'});
    case MatchStatus.INTERVAL:
      console.log('In interval time');
      return res.status(400).send({status: 'UnacceptableTime'});
    }

    let teamStaging = match.stagingMoves.find((en) => en.teamID == team.code);
    const otherTeam = match.stagingMoves.filter((en) => en.teamID != team.code);

    if (teamStaging == null) {
      teamStaging = {
        teamID: team.code,
      };
    };

    let actions = req.body.actions;
    actions = actions.map((en) => {
      en.turn = match.turn;
      return en;
    });
    teamStaging.agents = actions;

    otherTeam.push(teamStaging);
    match.stagingMoves = otherTeam;

    await match.save();

    res.json('ok');
  } catch (e) {
    console.error(e);
    logger.error(e);
    res.status(500).send('Server error');
  }
});

module.exports = router;
