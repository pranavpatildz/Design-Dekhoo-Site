const { validationResult } = require('express-validator'); // Added
const Furniture = require("../models/Furniture");
const { cloudinary } = require('../config/cloudinary'); // Added


exports.addFurniture = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let imagesArray = [];

    console.log("Uploaded Files:", req.files); // TEMP LOG FOR DEBUGGING

    if (req.files && req.files.length > 0) {
      imagesArray = req.files.map(file => ({
        url: file.path || file.secure_url,
        public_id: file.filename || file.public_id
      }));
    }

    const newFurniture = new Furniture({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      material: req.body.material,
      shopOwnerId: req.user._id,
      images: imagesArray
    });

    await newFurniture.save();

    res.status(201).json({ msg: 'Product added successfully', furniture: newFurniture });

  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(500).json({ message: "Server Error" });
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
        for (const image of furniture.images) {
            await cloudinary.uploader.destroy(image.public_id);
        }
        // Add new images
        furnitureFields.images = req.files.map(file => ({ url: file.secure_url, public_id: file.public_id }));
    } else if (furniture.images.length > 0 && (!req.body.existingImages || req.body.existingImages.length === 0)) {
        // If no new images are uploaded and no existing images are explicitly kept
        // and there were old images, delete them.
        for (const image of furniture.images) {
            await cloudinary.uploader.destroy(image.public_id);
        }
        furnitureFields.images = [];
    } else if (req.body.existingImages) {
        // Assuming req.body.existingImages is an array of objects { url, public_id } or a stringified version
        // This part might need further refinement based on how frontend sends this data
        if (typeof req.body.existingImages === 'string') {
          try {
            furnitureFields.images = JSON.parse(req.body.existingImages);
          } catch (e) {
            console.error("Failed to parse existingImages:", e);
            furnitureFields.images = []; // Fallback
          }
        } else if (Array.isArray(req.body.existingImages)) {
          furnitureFields.images = req.body.existingImages;
        } else {
          furnitureFields.images = [];
        }

        // Identify images to delete from Cloudinary (those in furniture.images but not in furnitureFields.images)
        const currentPublicIds = new Set(furnitureFields.images.map(img => img.public_id));
        for (const image of furniture.images) {
            if (!currentPublicIds.has(image.public_id)) {
                await cloudinary.uploader.destroy(image.public_id);
            }
        }

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
    res.status(500).json({ message: "Server Error" });
  }
};


exports.deleteFurniture = async (req, res) => {
  try {
    const furniture = await Furniture.findOne({ _id: req.params.id, shopOwnerId: req.user._id }); // Using req.user._id

    if (!furniture) {
      return res.status(404).json({ msg: 'Furniture not found or unauthorized' });
    }

    // Delete images from Cloudinary
    for (const image of furniture.images) {
        await cloudinary.uploader.destroy(image.public_id);
    }

    await furniture.deleteOne(); // Use deleteOne for Mongoose 6+

    res.json({ msg: 'Product removed successfully' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Furniture not found' });
    }
    res.status(500).json({ message: "Server Error" });
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
