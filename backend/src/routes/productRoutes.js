const express = require("express");
const router = express.Router();
const { check } = require('express-validator');
const { protect } = require("../middleware/auth");
const upload = require('../middleware/multer');
const {
  getMyProducts,
  addFurniture,
  updateFurniture,
  deleteFurniture
} = require("../controllers/productController");
const multer = require('multer'); // Import multer here for error handling

// Custom multer error handling middleware
const handleMulterErrors = (req, res, next) => {
  upload.array('images', 3)(req, res, function (err) { // Use 'upload.array' with the limit of 3
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ message: "Each image must be less than 5MB" });
      }
      // Handle other Multer errors if needed
      return res.status(400).json({ message: err.message });
    } else if (err) {
      // Handle other unknown errors
      return res.status(500).json({ message: err.message });
    }
    next(); // Continue to the next middleware/controller
  });
};


router.get("/my", protect, getMyProducts);

// @route   POST /api/products
// @desc    Add new furniture
// @access  Private
router.post(
  '/',
  [
    protect,
    handleMulterErrors, // Use the custom error handling middleware
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
    protect,
    handleMulterErrors, // Use the custom error handling middleware
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