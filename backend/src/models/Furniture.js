const mongoose = require('mongoose');

const FurnitureSchema = mongoose.Schema({
  shopOwnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ShopOwner',
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Bedroom', 'Living', 'Dining', 'Office', 'Kitchen', 'Art'], // Example categories, can be expanded
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  material: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  images: [
    {
      type: String, // URL of the image from Cloudinary
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Furniture', FurnitureSchema);
