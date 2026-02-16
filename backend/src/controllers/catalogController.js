const mongoose = require('mongoose'); // Import mongoose for ObjectId validation
const Furniture = require('../models/Furniture');

const getFurniture = async (req, res) => {
  const { category, material, city, minPrice, maxPrice } = req.query;
  const filter = {};

  if (category) filter.category = category;
  if (material) filter.material = material;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = parseInt(minPrice);
    if (maxPrice) filter.price.$lte = parseInt(maxPrice);
  }

  try {
    furniture = await Furniture.find(filter);
    res.json(furniture);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get all furniture for the authenticated shop owner
const getShopOwnerFurniture = async (req, res) => {
  try {
    const furniture = await Furniture.find({ shopOwnerId: req.shopOwner.id });
    res.json(furniture);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get a single furniture item by ID for the authenticated shop owner
const getFurnitureById = async (req, res) => {
  try {
    const furniture = await Furniture.findOne({ _id: req.params.id, shopOwnerId: req.shopOwner.id });

    if (!furniture) {
      return res.status(404).json({ msg: 'Furniture not found' });
    }
    res.json(furniture);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Furniture not found' });
    }
    res.status(500).send('Server Error');
  }
};

// Get all furniture for a specific shop owner by their ID (public)
const getPublicShopCatalog = async (req, res) => {
  try {
    const shopOwnerId = req.params.shopId;
    
    if (!mongoose.Types.ObjectId.isValid(shopOwnerId)) {
      return res.status(400).json({ msg: 'Invalid shop owner ID format' });
    }

    const furniture = await Furniture.find({ shopOwnerId }).sort({ title: 1 }); // Sort alphabetically by title

    if (!furniture || furniture.length === 0) {
      return res.status(404).json({ msg: 'No catalog found for this shop owner' });
    }
    res.json(furniture);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


module.exports = {
  getFurniture,
  getShopOwnerFurniture,
  getFurnitureById,
  getPublicShopCatalog,
};