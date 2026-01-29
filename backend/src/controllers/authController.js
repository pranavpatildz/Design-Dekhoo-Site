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
