const mongoose = require('mongoose');

const FurnitureSchema = mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String },
    images: [{ type: String }],
    price: { type: Number },
    material: { type: String },
    shopOwnerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }
});

module.exports = mongoose.model('Furniture', FurnitureSchema);