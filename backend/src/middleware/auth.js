const jwt = require('jsonwebtoken');
const ShopOwner = require('../models/ShopOwner'); // Import ShopOwner model

exports.jwtAuth = async function (req, res, next) { // Made async
  console.log("Protect middleware: req.cookies", req.cookies); // Debug log

  // Get token from cookie
  const token = req.cookies.token; // Read token from httpOnly cookie
  console.log("Protect middleware: Token from cookie:", token); // Debug log

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Fetch full shop owner object from DB
    const shopOwner = await ShopOwner.findById(decoded.id).select("-password"); // Use decoded.id
    if (!shopOwner) {
      return res.status(401).json({ msg: 'Authorization denied, shop owner not found' });
    }
    req.shopOwner = shopOwner; // Populate req.shopOwner with the full shop owner object
    next();
  } catch (err) {
    console.error("Protect middleware: JWT verification error:", err.message); // Debug log
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

exports.protect = async function (req, res, next) { // Made async
  const token = req.cookies.token;

  if (!token) {
    return res.redirect("/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Fetch full user object (ShopOwner) from DB
    const user = await ShopOwner.findById(decoded.id).select("-password"); // Use decoded.id
    if (!user) {
      return res.redirect("/login"); // Redirect if user not found (after valid token)
    }
    req.user = user; // Populate req.user with the full user object
    next();
  } catch (err) {
    console.error("Protect middleware: JWT verification error:", err.message); // Debug log for protect
    return res.redirect("/login"); // Redirect on token error
  }
};
