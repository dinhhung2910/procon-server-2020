const express = require('express');
const router = express.Router();

/**
 * @route POST /matches c
 * @desc Create random map with 2 team
 * @access authenticated
 */
router.put('/', [], async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const {
      fullname,
      avatar,
      description,
      hobbies,
      birthDate,
      phoneNumber,
      countryCode,
      address,
    } = req.body;

    if (fullname && fullname.trim()) user.fullname = fullname.trim();
    if (avatar) {
      try {
        const imagePath = SaveImage.SaveImage(avatar);
        user.avatar = imagePath;
      } catch (e) {
        res.status(400).json({
          errors: [
            {
              msg: 'Invalid image',
              param: 'avatar',
            },
          ],
        });
      }
    }
    if (description) user.description = description;
    if (hobbies) user.hobbies = hobbies;
    user.information = user.information || {};

    if (birthDate) {
      user.information.birthDate = birthDate;
    }
    // phone number and country code go together
    if (phoneNumber && countryCode) {
      user.information.phoneNumber = phoneNumber;
      user.information.countryCode = countryCode;
    }

    if (address) {
      user.information.address = address;
    }

    await user.save();
    // update mapping comments
    Comment.find({userId: user._id})
      .then((comments) => {
        comments.forEach(async (comment) => {
          comment.fullname = user.fullname;
          comment.avatar = user.avatar;
          try {
            await comment.save();
          } catch (e) {
            console.error(e);
          }
        });
      })
      .catch();

    // populate Follower
    Follower.find({userId: user._id}).then((followers) => {
      followers.forEach(async (follower) => {
        follower.user = {
          fullname: user.fullname,
          avatar: user.avatar,
          username: user.username,
        };

        try {
          await follower.save();
        } catch (e) {
          loggers.error(e);
        }
      });
    });

    user.password = null;
    res.json(user);
  } catch (e) {
    logger.error(e);
    res.status(500).send('Server error');
  }
});

module.exports = router;
