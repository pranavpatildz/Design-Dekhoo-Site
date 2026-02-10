const { validationResult } = require('express-validator');
const Furniture = require('../models/Furniture');
const { cloudinary } = require('../config/cloudinary'); // Import Cloudinary

const addFurniture = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { category, title, material, price, description } = req.body;

  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ msg: 'At least one image is required' });
    }

    const images = req.files.map(file => file.path);

    const newFurniture = new Furniture({
      shopOwnerId: req.shopOwner.id,
      category,
      title,
      material,
      price,
      description,
      images,
    });

    const furniture = await newFurniture.save();
    res.status(201).json({ msg: 'Product added successfully', furniture });
  } catch (err)
  {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

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
    let furniture;
    if (city) {
      const aggregateQuery = [
        {
          $lookup: {
            from: 'shopowners',
            localField: 'shopOwnerId',
            foreignField: '_id',
            as: 'shopOwner',
          },
        },
        {
          $unwind: '$shopOwner',
        },
        {
          $match: {
            ...filter,
            'shopOwner.city': new RegExp(city, 'i'), // Case-insensitive city search
          },
        },
      ];
      furniture = await Furniture.aggregate(aggregateQuery);
    } else {
      furniture = await Furniture.find(filter);
    }
    res.json(furniture);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get all furniture for the authenticated shop owner
const getShopOwnerFurniture = async (req, res) => {
  try {
    const furniture = await Furniture.find({ shopOwnerId: req.shopOwner.id }).sort({ createdAt: -1 });
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

// Update a furniture item by ID for the authenticated shop owner
const updateFurniture = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { category, title, material, price, description } = req.body;
  const furnitureFields = { category, title, material, price, description };

  try {
    let furniture = await Furniture.findOne({ _id: req.params.id, shopOwnerId: req.shopOwner.id });

    if (!furniture) {
      return res.status(404).json({ msg: 'Furniture not found or unauthorized' });
    }

    // Handle image updates
    if (req.files && req.files.length > 0) {
        // Delete old images from Cloudinary
        for (const imageUrl of furniture.images) {
            const publicId = imageUrl.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`design-dekhoo/${publicId}`);
        }
        // Add new images
        furnitureFields.images = req.files.map(file => file.path);
    } else if (furniture.images.length > 0 && (!req.body.existingImages || req.body.existingImages.length === 0)) {
        // If no new images are uploaded and no existing images are explicitly kept
        // and there were old images, delete them.
        for (const imageUrl of furniture.images) {
            const publicId = imageUrl.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`design-dekhoo/${publicId}`);
        }
        furnitureFields.images = [];
    } else if (req.body.existingImages) {
        // If existing images are passed as a comma-separated string, use them
        furnitureFields.images = req.body.existingImages.split(',');
    } else {
        // If no new files and no existingImages field, keep the old ones
        furnitureFields.images = furniture.images;
    }


    furniture = await Furniture.findOneAndUpdate(
      { _id: req.params.id, shopOwnerId: req.shopOwner.id },
      { $set: furnitureFields },
      { new: true }
    );

    res.json({ msg: 'Product updated successfully', furniture });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Furniture not found' });
    }
    res.status(500).send('Server Error');
  }
};

// Delete a furniture item by ID for the authenticated shop owner
const deleteFurniture = async (req, res) => {
  try {
    const furniture = await Furniture.findOne({ _id: req.params.id, shopOwnerId: req.shopOwner.id });

    if (!furniture) {
      return res.status(404).json({ msg: 'Furniture not found or unauthorized' });
    }

    // Delete images from Cloudinary
    for (const imageUrl of furniture.images) {
        const publicId = imageUrl.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`design-dekhoo/${publicId}`);
    }

    await furniture.deleteOne(); // Use deleteOne for Mongoose 6+

    res.json({ msg: 'Product removed successfully' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Furniture not found' });
    }
    res.status(500).send('Server Error');
  }
};

module.exports = {
  addFurniture,
  getFurniture,
  getShopOwnerFurniture,
  getFurnitureById,
  updateFurniture,
  deleteFurniture,
};
