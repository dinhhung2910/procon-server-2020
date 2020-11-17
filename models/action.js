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
    enum: Object.values(ActionType),
  },
  dx: {
    type: Number,
    required: true,
    enum: Object.values(HorizontialMoveType),
  },
  dy: {
    type: Number,
    required: true,
    enum: Object.values(VerticalMoveType),
  },
  turn: {
    type: Number,
  },
  apply: {
    type: Number,
    default: ActionStatus.VALID,
    enum: Object.values(ActionStatus),
  },
});

module.exports = Action = mongoose.model('action', ActionSchema);
