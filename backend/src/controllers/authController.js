const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // Import crypto module
const nodemailer = require('nodemailer'); // Import nodemailer
const ShopOwner = require('../models/ShopOwner');

exports.signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, shopName, city, mobileNumber } = req.body;

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
      mobileNumber,
    });

    const salt = await bcrypt.genSalt(10);
    shopOwner.password = await bcrypt.hash(password, salt);

    await shopOwner.save();

    res.redirect('/login?signup=success');
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

  // Normalize email for consistent lookup
  const normalizedEmail = email.trim().toLowerCase();

  try {
    let shopOwner = await ShopOwner.findOne({ email: normalizedEmail });

    if (!shopOwner) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, shopOwner.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Set user in session
    req.session.user = {
      id: shopOwner.id,
      name: shopOwner.name,
      email: shopOwner.email,
      shopName: shopOwner.shopName,
      city: shopOwner.city,
      phone: shopOwner.phone,
      address: shopOwner.address,
      googleMapsLink: shopOwner.googleMapsLink,
      profileImage: shopOwner.profileImage, // Ensure profileImage is included if it exists in the model
    };

    res.redirect('/shop-dashboard');
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Request password reset link
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;

  try {
    const shopOwner = await ShopOwner.findOne({ email });

    // Always respond with a generic message to prevent user enumeration
    if (!shopOwner) {
      return res.status(200).json({ msg: 'If an account with that email exists, a password reset link has been sent.' });
    }

    // Generate a secure token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Set token and expiry on shop owner
    shopOwner.resetToken = resetToken;
    shopOwner.resetTokenExpire = Date.now() + 300000; // 5 minutes from now

    await shopOwner.save();

    // Create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER, // generated ethereal user
        pass: process.env.EMAIL_PASS, // generated ethereal password
      },
    });

    // Send mail with defined transport object
    const resetURL = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
    const mailOptions = {
      from: '"DesignDekhoo" <dekhoodesign@gmail.com>', // sender address
      to: shopOwner.email, // list of receivers
      subject: 'Password Reset Request', // Subject line
      html: `
        <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
        <p>Please click on the following link, or paste this into your browser to complete the process within five minutes of receiving it:</p>
        <p><a href="${resetURL}">${resetURL}</a></p>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error('Error sending password reset email:', emailError);
      // Even if email fails, respond with generic message for security
      return res.status(200).json({ msg: 'If an account with that email exists, a password reset link has been sent.' });
    }

    res.status(200).json({ msg: 'If an account with that email exists, a password reset link has been sent.' });

  } catch (err) {
    console.error('Forgot password error:', err.message);
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

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { password } = req.body;

  try {
    const shopOwner = await ShopOwner.findOne({
      resetToken: req.params.token,
      resetTokenExpire: { $gt: Date.now() }, // Token not expired
    });

    if (!shopOwner) {
      return res.status(400).json({ msg: 'Invalid or expired token' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    shopOwner.password = await bcrypt.hash(password, salt);

    // Clear reset token fields
    shopOwner.resetToken = undefined;
    shopOwner.resetTokenExpire = undefined;

    await shopOwner.save();

    res.status(200).json({ msg: 'Password reset successfully. Redirecting to login...', redirectTo: '/login' });

  } catch (err) {
    console.error('Reset password error:', err.message);
    res.status(500).send('Server error');
  }
};
