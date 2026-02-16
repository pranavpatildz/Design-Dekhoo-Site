const express = require('express');
const router = express.Router();
const { jwtAuth } = require('../middleware/auth'); // Only jwtAuth remains
const { 
  getFurniture, 
  getShopOwnerFurniture, 
  getFurnitureById, 
  getPublicShopCatalog
} = require('../controllers/catalogController');

// @route   GET api/catalog
// @desc    Get all furniture with optional filters
// @access  Public
router.get('/', getFurniture);

// @route   GET api/catalog/my-products
// @desc    Get all furniture belonging to the authenticated shop owner
// @access  Private
router.get('/my-products', jwtAuth, getShopOwnerFurniture); // Reverted to jwtAuth

// @route   GET api/catalog/:shopId (Public Catalog View)
// @desc    Get all furniture for a specific shop owner by their ID (public)
// @access  Public
router.get('/:shopId', getPublicShopCatalog);

// @route   GET api/catalog/:id
// @desc    Get a single furniture item by ID
// @access  Private (only owner can view their own)
router.get('/:id', jwtAuth, getFurnitureById);


module.exports = router;