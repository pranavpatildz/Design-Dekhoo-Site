const mongoose = require('mongoose');

const MaterialSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true // Material names should be unique for a given shop
  },
  shopOwnerId: { // Consistent with Category and Furniture models
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ShopOwner',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure a shop owner cannot have two materials with the same name
MaterialSchema.index({ name: 1, shopOwnerId: 1 }, { unique: true });

module.exports = mongoose.model('Material', MaterialSchema);
