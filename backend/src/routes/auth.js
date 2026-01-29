const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');

// @route   POST api/auth/signup
// @desc    Register a new shop owner
// @access  Public
router.post(
  '/signup',
  [
    check('name', 'Please add a name').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
    check('shopName', 'Please add a shop name').not().isEmpty(),
    check('city', 'Please add a city').not().isEmpty(),
  ],
  authController.signup
);

// @route   POST api/auth/login
// @desc    Authenticate shop owner & get token
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  authController.login
);

module.exports = router;
