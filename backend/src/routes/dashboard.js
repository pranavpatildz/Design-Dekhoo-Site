const express = require('express');
const router = express.Router();
const { jwtAuth } = require('../middleware/auth'); // Import jwtAuth middleware
const authController = require('../controllers/authController'); // Import authController
const dashboardController = require('../controllers/dashboardController'); // Import dashboardController

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

// @route   POST api/dashboard/add-category
// @desc    Add a new custom category for the shop owner
// @access  Private
router.post('/add-category', jwtAuth, dashboardController.addCategory);

// @route   POST api/dashboard/add-material
// @desc    Add a new custom material for the shop owner
// @access  Private
router.post('/add-material', jwtAuth, dashboardController.addMaterial);

// @route   GET api/dashboard/products
// @desc    Get all products for the logged-in shop owner
// @access  Private
router.get('/products', jwtAuth, dashboardController.getAllProductsForOwner);

// @route   GET api/dashboard/product/:id
// @desc    Get a single product for editing (if owner)
// @access  Private
router.get('/product/:id', jwtAuth, dashboardController.getProductById);

// @route   DELETE api/dashboard/product/:id
// @desc    Delete a product (if owner)
// @access  Private
router.delete('/product/:id', jwtAuth, dashboardController.deleteProduct);

module.exports = router;
