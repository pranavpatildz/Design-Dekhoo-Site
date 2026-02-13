const cloudinary = require("cloudinary").v2;
const multerStorageCloudinary = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = multerStorageCloudinary({
  cloudinary: cloudinary,
  folder: "design-dekhoo",
  allowedFormats: ["jpg", "png", "jpeg"],
});

module.exports = {
  cloudinary,
  storage,
};
