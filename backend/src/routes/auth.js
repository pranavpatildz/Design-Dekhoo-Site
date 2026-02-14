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
      'Please enter a password with 4 or more characters'
    ).isLength({ min: 4 }),
    check('shopName', 'Please add a shop name').not().isEmpty(),
    check('city', 'Please add a city').not().isEmpty(),
    check('mobileNumber', 'Please include a valid 10-digit mobile number')
      .isString()
      .isLength({ min: 10, max: 10 })
      .matches(/^\d{10}$/),
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

// @route   POST api/auth/forgot-password
// @desc    Request password reset link
// @access  Public
router.post(
  '/forgot-password',
  [
    check('email', 'Please include a valid email').isEmail(),
  ],
  authController.forgotPassword
);

// @route   POST api/auth/reset-password/:token
// @desc    Reset password with token
// @access  Public
router.post(
  '/reset-password/:token',
  [
    check('password', 'Please enter a password with 4 or more characters').isLength({ min: 4 }),
  ],
  authController.resetPassword
);

const { jwtAuth } = require('../middleware/auth'); // Import jwtAuth middleware

// @route   GET api/auth/me
// @desc    Get current shop owner's profile
// @access  Private
router.get('/me', jwtAuth, authController.getShopOwnerProfile);

module.exports = router;
