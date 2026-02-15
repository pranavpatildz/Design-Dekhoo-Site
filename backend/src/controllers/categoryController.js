const { validationResult } = require('express-validator');
const Category = require('../models/Category');
const Furniture = require('../models/Furniture'); // Needed for deletion checks

// @desc    Add a new category for the authenticated shop owner
// @route   POST /api/categories
// @access  Private
const addCategory = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name } = req.body;

  try {
    const newCategory = new Category({
      name: name,
      shopOwnerId: req.shopOwner._id,
      isCustom: true, // All categories added by the user are custom
    });

    const category = await newCategory.save();
    res.status(201).json(category);
  } catch (err) {
    console.error('Error in addCategory:', err); // Log full error
    if (err.code === 11000) { // Duplicate key error
        return res.status(400).json({ msg: 'Category with this name already exists for your shop.' });
    }
    res.status(500).send('Server Error');
  }
};

// @desc    Get all categories for the authenticated shop owner
// @route   GET /api/categories
// @access  Private
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ shopOwnerId: req.shopOwner._id }).sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    console.error('Error in getCategories:', err); // Log full error
    res.status(500).send('Server Error');
  }
};

// @desc    Update a category by ID for the authenticated shop owner
// @route   PUT /api/categories/:id
// @access  Private
const updateCategory = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name } = req.body;

    try {
        let category = await Category.findOne({ _id: req.params.id, shopOwnerId: req.shopOwner._id });

        if (!category) {
            return res.status(404).json({ msg: 'Category not found or unauthorized' });
        }

        // Prevent updating default categories if we ever introduce them with isCustom: false
        if (!category.isCustom) {
            return res.status(403).json({ msg: 'Cannot update default categories' });
        }

        category.name = name;
        await category.save(); // save will trigger the unique index validation

        res.json(category);
    } catch (err) {
        console.error(err.message);
        if (err.code === 11000) { // Duplicate key error
            return res.status(400).json({ msg: 'Category with this name already exists for your shop.' });
        }
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Category not found' });
        }
        res.status(500).send('Server Error');
    }
};

// @desc    Delete a category by ID for the authenticated shop owner
// @route   DELETE /api/categories/:id
// @access  Private
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ _id: req.params.id, shopOwnerId: req.shopOwner._id });

    if (!category) {
      return res.status(404).json({ msg: 'Category not found or unauthorized' });
    }

    // Prevent deleting default categories
    if (!category.isCustom) {
        return res.status(403).json({ msg: 'Cannot delete default categories' });
    }

    // Check if any furniture items are associated with this category
    const associatedFurniture = await Furniture.countDocuments({ category: category.name });
    if (associatedFurniture > 0) {
      return res.status(400).json({ msg: 'Cannot delete category with associated furniture products. Please reassign or delete products first.' });
    }

    await category.deleteOne();

    res.json({ msg: 'Category removed successfully' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Category not found' });
    }
    res.status(500).send('Server Error');
  }
};


module.exports = {
  addCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};