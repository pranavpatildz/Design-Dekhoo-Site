const Furniture = require('../models/Furniture');
const Category = require('../models/Category'); // Import Category model
const Material = require('../models/Material'); // Import Material model

// @desc    Get all products for the logged-in shop owner
// @route   GET /api/dashboard/products
// @access  Private
exports.getAllProductsForOwner = async (req, res) => {
  try {
    const products = await Furniture.find({ shopOwnerId: req.shopOwner._id });
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get a single product by ID (for editing)
// @route   GET /api/dashboard/product/:id
// @access  Private
exports.getProductById = async (req, res) => {
  try {
    const product = await Furniture.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    // Check if the fetched product belongs to the logged-in shop owner
    if (product.shopOwnerId.toString() !== req.shopOwner._id) {
      return res.status(401).json({ msg: 'Not authorized to view this product' });
    }

    res.json(product);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.status(500).send('Server error');
  }
};

// @desc    Delete a product
// @route   DELETE /api/dashboard/product/:id
// @access  Private
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Furniture.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    // Check if the fetched product belongs to the logged-in shop owner
    if (product.shopOwnerId.toString() !== req.shopOwner._id) {
      return res.status(401).json({ msg: 'Not authorized to delete this product' });
    }

    await product.deleteOne(); // Use deleteOne() instead of remove()
    res.json({ msg: 'Product removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.status(500).send('Server error');
  }
};

// @desc    Add a new custom category
// @route   POST /api/dashboard/add-category
// @access  Private
exports.addCategory = async (req, res) => {
  const { name } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ msg: 'Category name is required' });
  }

  try {
    // Check for duplicate category name for the same shop owner
    const existingCategory = await Category.findOne({ name: name.trim(), shopOwnerId: req.shopOwner._id });
    if (existingCategory) {
      return res.status(400).json({ msg: 'Category with this name already exists' });
    }

    const newCategory = new Category({
      name: name.trim(),
      shopOwnerId: req.shopOwner._id,
    });

    const category = await newCategory.save();
    res.status(201).json({ msg: 'Category added successfully', category });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Add a new custom material
// @route   POST /api/dashboard/add-material
// @access  Private
exports.addMaterial = async (req, res) => {
  const { name } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ msg: 'Material name is required' });
  }

  try {
    // Check for duplicate material name for the same shop owner
    const existingMaterial = await Material.findOne({ name: name.trim(), shopOwnerId: req.shopOwner._id });
    if (existingMaterial) {
      return res.status(400).json({ msg: 'Material with this name already exists' });
    }

    const newMaterial = new Material({
      name: name.trim(),
      shopOwnerId: req.shopOwner._id,
    });

    const material = await newMaterial.save();
    res.status(201).json({ msg: 'Material added successfully', material });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};