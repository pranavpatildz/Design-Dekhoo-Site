const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const categoryController = require('../controllers/categoryController');

// @route   POST /api/categories
// @desc    Add a new category
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('name', 'Category name is required').not().isEmpty(),
    ],
  ],
  categoryController.addCategory
);

// @route   GET /api/categories
// @desc    Get all categories for the authenticated shop owner
// @access  Private
router.get('/', auth, categoryController.getCategories);

// @route   PUT /api/categories/:id
// @desc    Update a category by ID
// @access  Private
router.put(
    '/:id',
    [
        auth,
        [
            check('name', 'Category name is required').not().isEmpty(),
        ],
    ],
    categoryController.updateCategory
);

// @route   DELETE /api/categories/:id
// @desc    Delete a category by ID
// @access  Private
router.delete('/:id', auth, categoryController.deleteCategory);

module.exports = router;
