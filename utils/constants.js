const ActionType = {
  MOVE: 'move',
  REMOVE: 'remove',
  STAY: 'stay',
};

const HorizontialMoveType = {
  LEFT: -1,
  STAY: 0,
  RIGHT: 1,
};

const VerticalMoveType = {
  UP: -1,
  STAY: 0,
  DOWN: 1,
};

const ActionStatus = {
  DISABLED: -1,
  CONFLICTED: 0,
  VALID: 1,
};

module.exports = {
  ActionType,
  HorizontialMoveType,
  VerticalMoveType,
  ActionStatus,
};
