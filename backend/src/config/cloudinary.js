const cloudinary = require("cloudinary"); // Import the main cloudinary object
// Import multer-storage-cloudinary and access CloudinaryStorage explicitly
const multerStorageCloudinary = require("multer-storage-cloudinary");
const CloudinaryStorage = multerStorageCloudinary.CloudinaryStorage || multerStorageCloudinary;


cloudinary.v2.config({ // Keep configuring v2
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary, // Pass the full cloudinary object
  params: {
    folder: "designdekhoo",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

module.exports = {
  cloudinary: cloudinary, // Export the full cloudinary object
  storage,
};