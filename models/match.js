const mongoose = require('mongoose');
const action = require('./action');
const Treasure = require('./treasure').schema;
const Coordinate = require('./coordinate').schema;
const Agent = require('./agent').schema;
const Action = require('./action').schema;

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
      agents: [Agent],
    },
  ],
  actions: [Action],
});

module.exports = Match = mongoose.model('match', MatchSchema);
