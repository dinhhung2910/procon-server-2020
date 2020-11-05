const express = require('express');
const adminauth = require('../../../middleware/adminauth');
const router = express.Router();
const logger = require('../../../logger/winston');
const {generateMap} = require('../../../utils/generateMap');

/**
 * @route POST /api/admin/matches
 * @desc Create random map with 2 team
 * @access authenticated
 */
router.post('/', [adminauth], async (req, res) => {
  try {
    const {
      width,
      height,
    } = req.body;

    const resT = await generateMap(width, height);

    res.json(resT);
  } catch (e) {
    logger.error(e);
    res.status(500).send('Server error');
  }
});

module.exports = router;
