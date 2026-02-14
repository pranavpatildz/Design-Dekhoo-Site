const express = require('express');
const router = express.Router();
const { jwtAuth } = require('../middleware/auth'); // Import jwtAuth middleware
const authController = require('../controllers/authController'); // Import authController

// @route   GET api/dashboard
// @desc    Test protected route
// @access  Private
router.get('/', jwtAuth, async (req, res) => {
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
router.post('/profile/update', jwtAuth, authController.updateShopProfile);

module.exports = router;
