const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const upload = require('../middleware/multer');
const { 
  addFurniture, 
  getFurniture, 
  getShopOwnerFurniture, 
  getFurnitureById, 
  updateFurniture, 
  deleteFurniture 
} = require('../controllers/catalogController');

// @route   GET api/catalog
// @desc    Get all furniture with optional filters
// @access  Public
router.get('/', getFurniture);

// @route   GET api/catalog/my-products
// @desc    Get all furniture belonging to the authenticated shop owner
// @access  Private
router.get('/my-products', auth, getShopOwnerFurniture);

// @route   GET api/catalog/:id
// @desc    Get a single furniture item by ID
// @access  Private (only owner can view their own)
router.get('/:id', auth, getFurnitureById);


// @route   POST api/catalog/add
// @desc    Add new furniture
// @access  Private
router.post(
  '/add',
  [
    auth,
    upload.array('images', 5), // 'images' is the field name, 5 is the max number of files
    [
      check('category', 'Category is required').not().isEmpty(),
      check('title', 'Title is required').not().isEmpty(),
      check('material', 'Material is required').not().isEmpty(),
      check('price', 'Please enter a valid price').isNumeric(),
    ],
  ],
  addFurniture
);

// @route   PUT api/catalog/:id
// @desc    Update a furniture item by ID
// @access  Private (only owner can update their own)
router.put(
  '/:id',
  [
    auth,
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

// @route   DELETE api/catalog/:id
// @desc    Delete a furniture item by ID
// @access  Private (only owner can delete their own)
router.delete('/:id', auth, deleteFurniture);


module.exports = router;
