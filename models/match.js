const mongoose = require('mongoose');
const Treasure = require('./treasure').schema;
const Coordinate = require('./coordinate').schema;
const Agent = require('./agent').schema;
const Action = require('./action').schema;
const {MatchStatus} = require('../utils/constants');

const MatchSchema = new mongoose.Schema({
  code: {
    type: Number,
    required: true,
  },
  agentsNum: {
    type: Number,
    required: true,
  },
  blueTeamCode: {
    type: Number,
    required: true,
  },
  blueTeamName: {
    type: String,
    required: true,
  },
  redTeamCode: {
    type: Number,
    required: true,
  },
  redTeamName: {
    type: String,
    required: true,
  },
  width: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  startedAtUnixTime: {
    type: Date,
    required: true,
    default: new Date(),
  },
  intervalMillis: {
    type: Number,
    required: true,
    default: 15000,
  },
  turnMillis: {
    type: Number,
    required: true,
    default: 15000,
  },
  turn: {
    type: Number,
    required: true,
    default: 0,
  },
  maxTurn: {
    type: Number,
    required: true,
    default: 0,
  },
  teams: [{
    teamID: {
      type: Number,
      required: true,
    },
    agents: [Agent],
    tilePoint: {
      type: Number,
      required: true,
      default: 0,
    },
    areaPoint: {
      type: Number,
      required: true,
      default: 0,
    },
  }],
  points: [[Number]],
  tiled: [[Number]],
  obstacles: [Coordinate],
  treasure: [Treasure],
  stagingMoves: [
    {
      teamID: {
        type: Number,
        required: true,
      },
      agents: [Action],
    },
  ],
  actions: [Action],
});

const Match = mongoose.model('match', MatchSchema);

Match.prototype.getCurrentStatus = function() {
  const timestamp = new Date();

  if (timestamp < this.startedAtUnixTime) {
    return MatchStatus.EARLY;
  }

  // check unacceptable time
  // after the match is over
  // or not in update time
  const maxTurn = this.maxTurn;
  const intervalMillis = this.intervalMillis;
  const turnMillis = this.turnMillis;

  // TOO LATE!
  // eslint-disable-next-line max-len
  const endTime = this.startedAtUnixTime.getTime() + maxTurn * (intervalMillis + turnMillis);

  if (timestamp > endTime) {
    return MatchStatus.ENDED;
  }

  // UPDATE IN INTERVAL TIME
  // eslint-disable-next-line max-len
  if ((timestamp - this.startedAtUnixTime) % (intervalMillis + turnMillis) > turnMillis) {
    return MatchStatus.INTERVAL;
  }

  // IN TURN TIME
  return MatchStatus.TURN;
};

module.exports = Match;
