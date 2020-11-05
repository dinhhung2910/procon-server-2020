const mongoose = require('mongoose');

const TreasureSchema = new mongoose.Schema({
  status: {
    type: Number,
    required: true,
  },
  point: {
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
});

module.exports =
Treasure =
mongoose.model('treasure', TreasureSchema);
