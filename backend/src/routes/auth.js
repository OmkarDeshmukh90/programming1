const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Mock user database (in production, use a real database)
let users = [];
let userIdCounter = 1;

// Add a demo user for testing
const initializeDemoUser = async () => {
  const demoPassword = await bcrypt.hash('DemoPass123', 12);
  users.push({
    id: userIdCounter++,
    username: 'demo_user',
    email: 'demo@example.com',
    password: demoPassword,
    points: 1250,
    streak: 7,
    level: 3,
    solvedProblems: 15,
    totalSubmissions: 45,
    joinDate: new Date('2024-01-01'),
    lastActive: new Date(),
    preferences: {
      theme: 'light',
      language: 'en',
      notifications: true
    },
    skills: {
      'arrays': 4,
      'strings': 3,
      'dynamic-programming': 2
    },
    role: 'user'
  });
};

// Initialize demo user when the server starts
initializeDemoUser();

// Validation middleware
const validateRegistration = [
  body('username')
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be between 3 and 20 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number')
];

const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', validateRegistration, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation failed',
        details: errors.array()
      }
    });
  }

  const { username, email, password } = req.body;

  // Check if user already exists
  const existingUser = users.find(user => 
    user.email === email || user.username === username
  );

  if (existingUser) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'User already exists',
        details: existingUser.email === email ? 'Email already registered' : 'Username already taken'
      }
    });
  }

  // Hash password
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create new user
  const newUser = {
    id: userIdCounter++,
    username,
    email,
    password: hashedPassword,
    points: 0,
    streak: 0,
    level: 1,
    solvedProblems: 0,
    totalSubmissions: 0,
    joinDate: new Date(),
    lastActive: new Date(),
    preferences: {
      theme: 'light',
      language: 'en',
      notifications: true
    },
    skills: {},
    role: 'user'
  };

  users.push(newUser);

  // Generate JWT token
  const token = jwt.sign(
    { 
      id: newUser.id, 
      username: newUser.username, 
      email: newUser.email,
      role: newUser.role
    },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );

  // Remove password from response
  const { password: _, ...userResponse } = newUser;

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    user: userResponse,
    token
  });
}));

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', validateLogin, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation failed',
        details: errors.array()
      }
    });
  }

  const { email, password } = req.body;

  // Find user by email
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Invalid credentials'
      }
    });
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Invalid credentials'
      }
    });
  }

  // Update last active
  user.lastActive = new Date();

  // Generate JWT token
  const token = jwt.sign(
    { 
      id: user.id, 
      username: user.username, 
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );

  // Remove password from response
  const { password: _, ...userResponse } = user;

  res.json({
    success: true,
    message: 'Login successful',
    user: userResponse,
    token
  });
}));

// @route   POST /api/auth/verify
// @desc    Verify JWT token and return user data
// @access  Private
router.post('/verify', asyncHandler(async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: {
        message: 'No token provided'
      }
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = users.find(u => u.id === decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'User not found'
        }
      });
    }

    // Update last active
    user.lastActive = new Date();

    // Remove password from response
    const { password: _, ...userResponse } = user;

    res.json({
      success: true,
      user: userResponse
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Invalid token'
      }
    });
  }
}));

// @route   POST /api/auth/refresh
// @desc    Refresh JWT token
// @access  Private
router.post('/refresh', asyncHandler(async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: {
        message: 'No token provided'
      }
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = users.find(u => u.id === decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'User not found'
        }
      });
    }

    // Generate new token
    const newToken = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      token: newToken
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Invalid token'
      }
    });
  }
}));

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post('/logout', asyncHandler(async (req, res) => {
  // In a stateless JWT system, logout is handled client-side
  // This endpoint can be used for logging purposes or future features
  res.json({
    success: true,
    message: 'Logout successful'
  });
}));

module.exports = router;
