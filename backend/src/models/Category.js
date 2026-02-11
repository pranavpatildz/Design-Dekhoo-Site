const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  shopOwnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ShopOwner',
    required: true,
  },
  isCustom: {
    type: Boolean,
    default: true, // Categories created by shop owners are custom
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure that a shop owner cannot have two categories with the same name
CategorySchema.index({ name: 1, shopOwnerId: 1 }, { unique: true });

module.exports = mongoose.model('Category', CategorySchema);
