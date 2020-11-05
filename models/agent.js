const mongoose = require('mongoose');

const AgentSchema = new mongoose.Schema({
  agentID: {
    type: Number,
    required: true,
  },
  x: {
    type: Number,
    required: true,
  },
  y: {
    type: Number,
    required: true,
  },
  tileScore: {
    type: Number,
    required: true,
  },
});

module.exports = Agent = mongoose.model('agent', AgentSchema);
