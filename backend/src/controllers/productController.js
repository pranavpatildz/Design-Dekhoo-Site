const { validationResult } = require('express-validator'); // Added
const Furniture = require("../models/Furniture");
const { cloudinary } = require('../config/cloudinary'); // Added


exports.addFurniture = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { category, title, material, price, description } = req.body;
    const shopOwnerId = req.user._id; // Using req.user._id as per product routes middleware
    // Images are now optional
    const images = req.files && req.files.length > 0 ? req.files.map(file => file.path) : [];

    const newFurniture = new Furniture({
      shopOwnerId,
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


exports.updateFurniture = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { category, title, material, price, description } = req.body;
  const furnitureFields = { category, title, material, price, description };

  try {
    let furniture = await Furniture.findOne({ _id: req.params.id, shopOwnerId: req.user._id }); // Using req.user._id

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
      { _id: req.params.id, shopOwnerId: req.user._id }, // Using req.user._id
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


exports.deleteFurniture = async (req, res) => {
  try {
    const furniture = await Furniture.findOne({ _id: req.params.id, shopOwnerId: req.user._id }); // Using req.user._id

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


exports.getMyProducts = async (req, res) => {
  try {
    const products = await Furniture.find({
      shopOwnerId: req.user._id
    })
    .populate("category")
    .sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
