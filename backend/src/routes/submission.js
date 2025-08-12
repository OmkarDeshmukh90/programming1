const express = require('express');
const { body, query, validationResult } = require('express-validator');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Mock submissions data (replace with database in production)
let submissions = [
  {
    id: 1,
    userId: 1,
    problemId: 1,
    language: 'python',
    code: `def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
    status: 'accepted',
    runtime: 45,
    memory: 14.2,
    submittedAt: '2024-01-15T10:30:00Z',
    testResults: [
      { testCase: 1, status: 'passed', input: '[2,7,11,15]', output: '[0,1]', expected: '[0,1]' },
      { testCase: 2, status: 'passed', input: '[3,2,4]', output: '[1,2]', expected: '[1,2]' },
      { testCase: 3, status: 'passed', input: '[3,3]', output: '[0,1]', expected: '[0,1]' }
    ]
  },
  {
    id: 2,
    userId: 1,
    problemId: 2,
    language: 'javascript',
    code: `function isValid(s) {
    const stack = [];
    const brackets = {')': '(', '}': '{', ']': '['};
    
    for (const char of s) {
        if ('({['.includes(char)) {
            stack.push(char);
        } else {
            if (!stack.length || stack.pop() !== brackets[char]) {
                return false;
            }
        }
    }
    
    return stack.length === 0;
}`,
    status: 'accepted',
    runtime: 52,
    memory: 13.8,
    submittedAt: '2024-01-16T14:20:00Z',
    testResults: [
      { testCase: 1, status: 'passed', input: '()', output: 'true', expected: 'true' },
      { testCase: 2, status: 'passed', input: '()[]{}', output: 'true', expected: 'true' },
      { testCase: 3, status: 'passed', input: '(]', output: 'false', expected: 'false' }
    ]
  }
];

// @route   POST /api/submissions
// @desc    Submit code for a problem
// @access  Private
router.post('/', [
  body('problemId').isInt({ min: 1 }).withMessage('Problem ID must be a positive integer'),
  body('language').isIn(['python', 'javascript', 'java', 'cpp', 'c']).withMessage('Invalid programming language'),
  body('code').notEmpty().withMessage('Code is required')
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

  const { problemId, language, code } = req.body;
  const userId = req.user.id;

  // Mock code execution (replace with actual Judge0 API call)
  const mockExecution = () => {
    const random = Math.random();
    if (random > 0.3) {
      return {
        status: 'accepted',
        runtime: Math.floor(Math.random() * 100) + 20,
        memory: Math.random() * 10 + 10,
        testResults: [
          { testCase: 1, status: 'passed', input: 'test1', output: 'result1', expected: 'result1' },
          { testCase: 2, status: 'passed', input: 'test2', output: 'result2', expected: 'result2' },
          { testCase: 3, status: 'passed', input: 'test3', output: 'result3', expected: 'result3' }
        ]
      };
    } else {
      return {
        status: 'wrong_answer',
        runtime: Math.floor(Math.random() * 100) + 20,
        memory: Math.random() * 10 + 10,
        testResults: [
          { testCase: 1, status: 'passed', input: 'test1', output: 'result1', expected: 'result1' },
          { testCase: 2, status: 'failed', input: 'test2', output: 'wrong_result', expected: 'result2' },
          { testCase: 3, status: 'passed', input: 'test3', output: 'result3', expected: 'result3' }
        ]
      };
    }
  };

  const executionResult = mockExecution();

  // Create submission
  const submission = {
    id: submissions.length + 1,
    userId,
    problemId,
    language,
    code,
    status: executionResult.status,
    runtime: executionResult.runtime,
    memory: executionResult.memory,
    submittedAt: new Date().toISOString(),
    testResults: executionResult.testResults
  };

  submissions.push(submission);

  res.status(201).json({
    success: true,
    submission
  });
}));

// @route   GET /api/submissions
// @desc    Get user's submissions
// @access  Private
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['accepted', 'wrong_answer', 'runtime_error', 'compilation_error']).withMessage('Invalid status'),
  query('language').optional().isIn(['python', 'javascript', 'java', 'cpp', 'c']).withMessage('Invalid programming language'),
  query('problemId').optional().isInt({ min: 1 }).withMessage('Problem ID must be a positive integer')
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

  const { page = 1, limit = 20, status, language, problemId } = req.query;
  const userId = req.user.id;

  let userSubmissions = submissions.filter(s => s.userId === userId);

  // Apply filters
  if (status) {
    userSubmissions = userSubmissions.filter(s => s.status === status);
  }

  if (language) {
    userSubmissions = userSubmissions.filter(s => s.language === language);
  }

  if (problemId) {
    userSubmissions = userSubmissions.filter(s => s.problemId === parseInt(problemId));
  }

  // Sort by submission date (newest first)
  userSubmissions.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

  // Apply pagination
  const offset = (page - 1) * limit;
  const paginatedSubmissions = userSubmissions.slice(offset, offset + parseInt(limit));

  res.json({
    success: true,
    submissions: paginatedSubmissions,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: userSubmissions.length,
      totalPages: Math.ceil(userSubmissions.length / limit)
    }
  });
}));

// @route   GET /api/submissions/:id
// @desc    Get submission by ID
// @access  Private
router.get('/:id', asyncHandler(async (req, res) => {
  const submissionId = parseInt(req.params.id);
  const userId = req.user.id;

  const submission = submissions.find(s => s.id === submissionId && s.userId === userId);

  if (!submission) {
    return res.status(404).json({
      success: false,
      error: { message: 'Submission not found' }
    });
  }

  res.json({
    success: true,
    submission
  });
}));

// @route   GET /api/submissions/stats
// @desc    Get user submission statistics
// @access  Private
router.get('/stats', asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const userSubmissions = submissions.filter(s => s.userId === userId);

  const stats = {
    total: userSubmissions.length,
    accepted: userSubmissions.filter(s => s.status === 'accepted').length,
    wrongAnswer: userSubmissions.filter(s => s.status === 'wrong_answer').length,
    runtimeError: userSubmissions.filter(s => s.status === 'runtime_error').length,
    compilationError: userSubmissions.filter(s => s.status === 'compilation_error').length,
    acceptanceRate: userSubmissions.length > 0 
      ? (userSubmissions.filter(s => s.status === 'accepted').length / userSubmissions.length * 100).toFixed(1)
      : 0,
    averageRuntime: userSubmissions.length > 0
      ? (userSubmissions.reduce((sum, s) => sum + s.runtime, 0) / userSubmissions.length).toFixed(1)
      : 0,
    averageMemory: userSubmissions.length > 0
      ? (userSubmissions.reduce((sum, s) => sum + s.memory, 0) / userSubmissions.length).toFixed(1)
      : 0,
    languages: userSubmissions.reduce((acc, s) => {
      acc[s.language] = (acc[s.language] || 0) + 1;
      return acc;
    }, {}),
    recentSubmissions: userSubmissions
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
      .slice(0, 5)
  };

  res.json({
    success: true,
    stats
  });
}));

module.exports = router;


