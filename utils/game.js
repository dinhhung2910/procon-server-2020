const Match = require('../models/match');
const {ActionStatus, ActionType} = require('./constants');
/**
 * Get moves from staging area
 * Validate them
 * @param {ObjectId} matchId BsonId of the match
 */
async function validateMoves(matchId) {
  const match = await Match.findById(matchId);


  // check border
  match.checkBorder();

  // check empty cell
  match.checkEmptyCell();
  console.log(match.stagingMoves.map((en) => en.agents));

  // check wall
  // check treasure
  // check conflict
}


Match.prototype.checkBorder = function() {
  const [blueAgents, blueStagingAgents] = this.getAgents(this.blueTeamCode);
  const [redAgents, redStagingAgents] = this.getAgents(this.redTeamCode);
  this.validateAgentsBorder(blueAgents, blueStagingAgents, this.blueTeamCode);
  this.validateAgentsBorder(redAgents, redStagingAgents, this.redTeamCode);
};

/**
 * Check if next cell is empty
 * For MOVE type only
 */
Match.prototype.checkEmptyCell = function() {
  const [blueAgents, blueStagingAgents] = this.getAgents(this.blueTeamCode);
  const [redAgents, redStagingAgents] = this.getAgents(this.redTeamCode);
  this.validateNextAvailableCell(blueAgents, blueStagingAgents);
  this.validateNextAvailableCell(redAgents, redStagingAgents);
};

/**
 *
 * @param {Object} current
 * @param {Object} staging
 * @param {Number} teamID
 */
Match.prototype.validateNextAvailableCell = function(current, staging, teamID) {
  current.forEach((agent) => {
    const stagingAgent = staging.find((en) => en.agentID == agent.agentID);

    // No update for this agent
    if (!stagingAgent) {
      return;
    }
    // No disabled
    if (stagingAgent.apply == ActionStatus.DISABLED) {
      return;
    }
    // Not type moving
    if (stagingAgent.type != ActionType.MOVE) {
      return;
    }

    const nextCoor = {
      x: agent.x + stagingAgent.dx,
      y: agent.y + stagingAgent.dy,
    };
    const tile = this.tiled[nextCoor.x][nextCoor.y];
    if (tile != 0 && tile != teamID) {
      stagingAgent.apply = ActionStatus.DISABLED;
    }
  });
};

/**
 * Get agents of team
 * @return {Array} [currentAgents, stagingAgents]
 * @param {Number} teamID
 */
Match.prototype.getAgents = function(teamID) {
  const currentAgents = this.teams.find((en) => en.teamID == teamID);
  const stagingAgents = this.stagingMoves.find((en) => en.teamID == teamID);

  return [currentAgents.agents, stagingAgents ? stagingAgents.agents : []];
};

/**
 *
 * @param {Array} current
 * @param {Array} staging
 */
Match.prototype.validateAgentsBorder = function(current, staging) {
  current.forEach((agent) => {
    const stagingAgent = staging.find((en) => en.agentID == agent.agentID);

    // No update for this agent
    if (!stagingAgent) {
      return;
    }

    const nextCoor = {
      x: agent.x + stagingAgent.dx,
      y: agent.y + stagingAgent.dy,
    };
    if (!this.isInside(nextCoor)) {
      stagingAgent.apply = ActionStatus.DISABLED;
    }
  });
};

/**
 * Check if a coordinate is valid
 * @param {Object} coor coordinate
 * @param {Number} coor.x
 * @param {Number} coor.y
 * @return {Boolean} determine this coor is inside or not
 */
Match.prototype.isInside = function(coor) {
  let isValid = true;
  if (coor.x < 0 || coor.x >= this.height) {
    isValid = false;
  }
  if (coor.y < 0 || coor.y >= this.width) {
    isValid = false;
  }
  return isValid;
};


module.exports = {
  validateMoves,
};
