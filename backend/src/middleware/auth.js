const jwt = require('jsonwebtoken');

exports.jwtAuth = function (req, res, next) {
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
    req.shopOwner = decoded.shopOwner;
    next();
  } catch (err) {
    console.error("Protect middleware: JWT verification error:", err.message); // Debug log
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

exports.protect = function (req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect("/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // The protect middleware will set req.user
    next();
  } catch (err) {
    return res.redirect("/login");
  }
};
