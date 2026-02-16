const express = require("express");
const router = express.Router();
const { check } = require('express-validator'); // Added
const { protect } = require("../middleware/auth");
const upload = require('../middleware/multer'); // Added
const { 
  getMyProducts, // Already there
  addFurniture, // Added
  updateFurniture, // Added
  deleteFurniture // Added
} = require("../controllers/productController");

router.get("/my", protect, getMyProducts);

// @route   POST /api/products
// @desc    Add new furniture
// @access  Private
router.post(
  '/', // Changed from /add to /
  [
    protect, // Using protect middleware
    upload.array('images', 5), // 'images' is the field name, 5 is the max number of files
    [
      check('category', 'Category is required').not().isEmpty(),
      check('title', 'Title is required').not().isEmpty(),
      check('material', 'Material is required').optional().not().isEmpty(),
      check('price', 'Please enter a valid price').isNumeric(),
    ],
  ],
  addFurniture
);

// @route   PUT /api/products/:id
// @desc    Update a furniture item by ID
// @access  Private (only owner can update their own)
router.put(
  '/:id',
  [
    protect, // Using protect middleware
    upload.array('images', 5), // Allow image updates, optional
    [
      check('category', 'Category is required').optional().not().isEmpty(),
      check('title', 'Title is required').optional().not().isEmpty(),
      check('material', 'Material is required').optional().not().isEmpty(),
      check('price', 'Please enter a valid price').optional().isNumeric(),
    ],
  ],
  updateFurniture
);

// @route   DELETE /api/products/:id
// @desc    Delete a furniture item by ID
// @access  Private (only owner can delete their own)
router.delete('/:id', protect, deleteFurniture);

module.exports = router;