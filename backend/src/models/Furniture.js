const mongoose = require('mongoose');

const FurnitureSchema = mongoose.Schema({
    title: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    description: { type: String },
    images: [{
        url: { type: String, required: true },
        public_id: { type: String, required: true }
    }],
    price: { type: Number },
    material: { type: mongoose.Schema.Types.ObjectId, ref: "Material" },
    shopOwnerId: { type: mongoose.Schema.Types.ObjectId, ref: "ShopOwner", required: true }
});

module.exports = mongoose.model('Furniture', FurnitureSchema);