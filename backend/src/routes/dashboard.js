const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authController = require('../controllers/authController'); // Import authController

// @route   GET api/dashboard
// @desc    Test protected route
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    res.json({ msg: 'Welcome to the protected dashboard!', shopOwner: req.shopOwner });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/dashboard/profile/update
// @desc    Update shop owner profile
// @access  Private
router.post('/profile/update', auth, authController.updateShopProfile);

module.exports = router;
