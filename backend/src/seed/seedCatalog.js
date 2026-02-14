const mongoose = require("mongoose");
const dotenv = require("dotenv"); // Import dotenv
dotenv.config({ path: '../../.env' }); // Load .env from root

const Furniture = require("../models/Furniture");
const ShopOwner = require("../models/ShopOwner"); // Import ShopOwner model

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI not found in .env");
  process.exit(1);
}

const categories = [
  "Bedroom",
  "Living Room",
  "Dining",
  "Kitchen",
  "Office",
  "Storage",
  "Outdoor"
];

const materials = [
  "Teak Wood",
  "Sheesham Wood",
  "Oak Wood",
  "Engineered Wood",
  "Metal",
  "Marble",
  "Plywood"
];

// Helper function to get a random item from an array
const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Helper function to generate a random price
const getRandomPrice = () => Math.floor(Math.random() * (120000 - 5000 + 1)) + 5000;

async function seedCatalog() {
  console.log("Seeding started...");
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected successfully for seeding.");

    // Find the existing shop owner
    const shopOwner = await ShopOwner.findOne({ shopName: "A1 Furniture" });

    if (!shopOwner) {
      console.error("❌ Shop owner 'A1 Furniture' not found. Please create this user first.");
      process.exit(1); // Exit safely if user not found
    }

    // Clear old data ONLY for that shop
    console.log(`Clearing old furniture data for shop: ${shopOwner.shopName} (${shopOwner._id})...`);
    await Furniture.deleteMany({ shop: shopOwner._id });
    console.log("Old data cleared...");

    let products = [];
    const numberOfItems = 350; // As specified in the goal (300-400 range)

    for (let i = 1; i <= numberOfItems; i++) {
      const category = getRandomItem(categories);
      const material = getRandomItem(materials);
      const price = getRandomPrice();
      const adjective = getRandomItem(["Modern", "Classic", "Rustic", "Elegant", "Minimalist", "Industrial", "Bohemian"]);
      const itemType = getRandomItem(["Table", "Chair", "Sofa", "Bed", "Cabinet", "Desk", "Shelf"]);

      products.push({
        title: `${adjective} ${category} ${itemType} ${i}`,
        category,
        description: `Experience the comfort and style of this ${adjective.toLowerCase()} ${category.toLowerCase()} ${itemType.toLowerCase()}, crafted from high-quality ${material.toLowerCase()}. Perfect for any contemporary home.`,
        material,
        price,
        images: [
          `https://source.unsplash.com/600x400/?furniture,${category.toLowerCase()},${material.replace(/\s/g, '').toLowerCase()}`
        ],
        shop: shopOwner._id // Link product to the found shop owner
      });
    }

    await Furniture.insertMany(products);
    console.log(`Inserted ${products.length} furniture items for shop: ${shopOwner.shopName}.`);
    console.log("Seeding completed successfully.");

  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  } finally {
    mongoose.disconnect();
    console.log("MongoDB disconnected.");
  }
}

seedCatalog();