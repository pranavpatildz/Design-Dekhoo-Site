const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ShopOwner = require('../models/ShopOwner');

exports.signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, shopName, city } = req.body;

  try {
    let shopOwner = await ShopOwner.findOne({ email });

    if (shopOwner) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    shopOwner = new ShopOwner({
      name,
      email,
      password,
      shopName,
      city,
    });

    const salt = await bcrypt.genSalt(10);
    shopOwner.password = await bcrypt.hash(password, salt);

    await shopOwner.save();

    res.status(201).json({ msg: 'Shop owner registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    let shopOwner = await ShopOwner.findOne({ email });

    if (!shopOwner) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, shopOwner.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = {
      shopOwner: {
        id: shopOwner.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateShopProfile = async (req, res) => {
  console.log('Received profile update request body:', req.body); // Debug log

  const { shopName, name, phone, email, address, googleMapsLink } = req.body;

  // Build shopOwner object
  const shopOwnerFields = {};
  if (shopName) shopOwnerFields.shopName = shopName;
  if (name) shopOwnerFields.name = name; // Assuming 'name' in model is 'ownerName'
  if (phone) shopOwnerFields.phone = phone;
  if (email) shopOwnerFields.email = email;
  if (address) shopOwnerFields.address = address;
  if (googleMapsLink) shopOwnerFields.googleMapsLink = googleMapsLink;

  try {
    let shopOwner = await ShopOwner.findById(req.shopOwner.id);

    if (!shopOwner) {
      return res.status(404).json({ msg: 'Shop owner not found' });
    }

    // Check if email is being updated and if it's already taken by another user
    if (email && email !== shopOwner.email) {
      const existingEmail = await ShopOwner.findOne({ email });
      if (existingEmail && existingEmail.id !== req.shopOwner.id) {
        return res.status(400).json({ msg: 'Email already in use by another account' });
      }
    }

    shopOwner = await ShopOwner.findByIdAndUpdate(
      req.shopOwner.id,
      { $set: shopOwnerFields },
      { new: true, runValidators: true } // Return the updated document and run schema validators
    );

    // Redirect to dashboard (assuming this is handled client-side or by express app rendering)
    // For API, we'd typically send back the updated resource or a success message
    // Since the frontend is EJS, we need to consider how the redirect happens
    // For now, let's just send a success response. The actual redirect will be done by the route.
    res.json({ msg: 'Profile updated successfully', shopOwner });

  } catch (err) {
    console.error(err.message);
    // Handle specific validation errors if needed
    if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Shop owner not found' });
    }
    res.status(500).send('Server error');
  }
};

// @route   GET api/auth/me
// @desc    Get current shop owner's profile
// @access  Private
exports.getShopOwnerProfile = async (req, res) => {
  try {
    const shopOwner = await ShopOwner.findById(req.shopOwner.id).select('-password'); // Exclude password
    if (!shopOwner) {
      return res.status(404).json({ msg: 'Shop owner not found' });
    }
    res.json(shopOwner);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
