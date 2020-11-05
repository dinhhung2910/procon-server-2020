const mongoose = require('mongoose');

const CoordinateSchema = new mongoose.Schema({
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
Coordinate =
mongoose.model('coordinate', CoordinateSchema);
