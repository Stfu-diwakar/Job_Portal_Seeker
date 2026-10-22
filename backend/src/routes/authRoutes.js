const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, role, title, skills, bio } = req.body;

    // Edge Case: Empty Form Fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All Fields Required"
      });
    }

    // Edge Case: Duplicate Email
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        message: "Email Already Exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || 'jobseeker',
      title: title || 'Software Developer',
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : ['React', 'JavaScript']),
      bio: bio || ''
    });

    const jwtSecret = process.env.JWT_SECRET || 'supersecretjwtkey_jobportal_2026_dev_secure';
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, name: user.name },
      jwtSecret,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      message: "User Registered",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        title: user.title,
        skills: user.skills,
        bio: user.bio
      }
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Edge Case: Empty Form Fields
    if (!email || !password) {
      return res.status(400).json({
        message: "All Fields Required"
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({
        message: "Invalid User"
      });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({
        message: "Wrong Password"
      });
    }

    const jwtSecret = process.env.JWT_SECRET || 'supersecretjwtkey_jobportal_2026_dev_secure';
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name
      },
      jwtSecret,
      {
        expiresIn: "1d"
      }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        title: user.title,
        skills: user.skills,
        bio: user.bio
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/auth/me (Protected)
router.get('/me', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = { ...user };
    delete userData.password;
    res.json(userData);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
