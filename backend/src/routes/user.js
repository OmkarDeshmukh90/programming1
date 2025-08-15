const express = require('express');
const { body, validationResult } = require('express-validator');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Mock user data (replace with database in production)
let users = [
  {
    id: 1,
    username: 'demo_user',
    email: 'demo@example.com',
    profile: {
      name: 'Demo User',
      bio: 'Learning to code!',
      avatar: 'https://via.placeholder.com/150',
      joinDate: '2024-01-01',
      location: 'Earth',
      website: 'https://example.com'
    },
    stats: {
      problemsSolved: 15,
      totalSubmissions: 45,
      currentStreak: 7,
      longestStreak: 12,
      points: 1250,
      rank: 'Bronze'
    },
    preferences: {
      language: 'python',
      difficulty: 'medium',
      topics: ['arrays', 'strings', 'dynamic-programming']
    },
    achievements: [
      { id: 1, name: 'First Problem', description: 'Solved your first problem', earnedAt: '2024-01-01' },
      { id: 2, name: 'Week Warrior', description: 'Solved problems for 7 days in a row', earnedAt: '2024-01-08' }
    ]
  }
];

// @route   GET /api/user/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      error: { message: 'User not found' }
    });
  }

  res.json({
    success: true,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      profile: user.profile,
      stats: user.stats,
      preferences: user.preferences,
      achievements: user.achievements
    }
  });
}));

// @route   PUT /api/user/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
  body('name').optional().isLength({ min: 1, max: 100 }).withMessage('Name must be between 1 and 100 characters'),
  body('bio').optional().isLength({ max: 500 }).withMessage('Bio must be less than 500 characters'),
  body('location').optional().isLength({ max: 100 }).withMessage('Location must be less than 100 characters'),
  body('website').optional().isURL().withMessage('Website must be a valid URL')
], asyncHandler(async (req, res) => {
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

  const userId = req.user.id;
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      error: { message: 'User not found' }
    });
  }

  // Update profile fields
  const { name, bio, location, website } = req.body;
  if (name) user.profile.name = name;
  if (bio) user.profile.bio = bio;
  if (location) user.profile.location = location;
  if (website) user.profile.website = website;

  res.json({
    success: true,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      profile: user.profile,
      stats: user.stats,
      preferences: user.preferences,
      achievements: user.achievements
    }
  });
}));

// @route   GET /api/user/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats', asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      error: { message: 'User not found' }
    });
  }

  res.json({
    success: true,
    stats: user.stats
  });
}));

// @route   GET /api/user/achievements
// @desc    Get user achievements
// @access  Private
router.get('/achievements', asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      error: { message: 'User not found' }
    });
  }

  res.json({
    success: true,
    achievements: user.achievements
  });
}));

// @route   PUT /api/user/preferences
// @desc    Update user preferences
// @access  Private
router.put('/preferences', [
  body('language').optional().isIn(['python', 'javascript', 'java', 'cpp', 'c']).withMessage('Invalid programming language'),
  body('difficulty').optional().isIn(['easy', 'medium', 'hard']).withMessage('Invalid difficulty level'),
  body('topics').optional().isArray().withMessage('Topics must be an array')
], asyncHandler(async (req, res) => {
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

  const userId = req.user.id;
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      error: { message: 'User not found' }
    });
  }

  // Update preferences
  const { language, difficulty, topics } = req.body;
  if (language) user.preferences.language = language;
  if (difficulty) user.preferences.difficulty = difficulty;
  if (topics) user.preferences.topics = topics;

  res.json({
    success: true,
    preferences: user.preferences
  });
}));

// @route   GET /api/user/leaderboard
// @desc    Get leaderboard
// @access  Private
router.get('/leaderboard', asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;

  // Sort users by points (mock data)
  const sortedUsers = [...users].sort((a, b) => b.stats.points - a.stats.points);
  const paginatedUsers = sortedUsers.slice(offset, offset + parseInt(limit));

  res.json({
    success: true,
    leaderboard: paginatedUsers.map(user => ({
      id: user.id,
      username: user.username,
      profile: user.profile,
      stats: user.stats
    })),
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: users.length,
      totalPages: Math.ceil(users.length / limit)
    }
  });
}));

module.exports = router;


