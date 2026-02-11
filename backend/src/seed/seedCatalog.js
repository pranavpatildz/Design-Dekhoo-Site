const mongoose = require("mongoose");
require("dotenv").config(); // This auto loads .env from root

const Furniture = require("../models/Furniture");

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

    // Clear old data
    console.log("Clearing old furniture data...");
    await Furniture.deleteMany({}); // Delete all furniture items
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
        ]
        // shopOwnerId is optional, so not setting it for now in seed data
      });
    }

    await Furniture.insertMany(products);
    console.log(`Inserted ${products.length} furniture items.`);
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