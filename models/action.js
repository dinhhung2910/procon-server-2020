const mongoose = require('mongoose');
const {
  ActionType,
  HorizontialMoveType,
  VerticalMoveType,
  ActionStatus,
} = require('../utils/constants');

const ActionSchema = new mongoose.Schema({
  agentID: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: Object.keys(ActionType),
  },
  dx: {
    type: Number,
    required: true,
    enum: Object.keys(HorizontialMoveType),
  },
  dy: {
    type: Number,
    required: true,
    enum: Object.keys(VerticalMoveType),
  },
  turn: {
    type: Number,
    required: true,
  },
  apply: {
    type: Number,
    required: true,
    enum: Object.keys(ActionStatus),
  },
});

module.exports = Action = mongoose.model('action', ActionSchema);
