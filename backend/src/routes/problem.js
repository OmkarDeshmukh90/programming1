const express = require('express');
const { query, validationResult } = require('express-validator');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Mock problems data (replace with database in production)
const problems = [
  {
    id: 1,
    title: 'Two Sum',
    difficulty: 'easy',
    topics: ['array', 'hash-table'],
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]',
        explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].'
      }
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    testCases: [
      { input: [2, 7, 11, 15], target: 9, output: [0, 1] },
      { input: [3, 2, 4], target: 6, output: [1, 2] },
      { input: [3, 3], target: 6, output: [0, 1] }
    ],
    solution: {
      python: `def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
      javascript: `function twoSum(nums, target) {
    const seen = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (seen.has(complement)) {
            return [seen.get(complement), i];
        }
        seen.set(nums[i], i);
    }
    return [];
}`,
      java: `public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> seen = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (seen.containsKey(complement)) {
            return new int[]{seen.get(complement), i};
        }
        seen.put(nums[i], i);
    }
    return new int[]{};
}`
    },
    stats: {
      totalSubmissions: 1250,
      acceptedSubmissions: 890,
      acceptanceRate: 71.2
    }
  },
  {
    id: 2,
    title: 'Valid Parentheses',
    difficulty: 'easy',
    topics: ['string', 'stack'],
    description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    examples: [
      {
        input: 's = "()"',
        output: 'true',
        explanation: 'Valid parentheses.'
      },
      {
        input: 's = "()[]{}"',
        output: 'true',
        explanation: 'Valid parentheses.'
      },
      {
        input: 's = "(]"',
        output: 'false',
        explanation: 'Invalid parentheses.'
      }
    ],
    constraints: [
      '1 <= s.length <= 10^4',
      's consists of parentheses only \'()[]{}\''
    ],
    testCases: [
      { input: '()', output: true },
      { input: '()[]{}', output: true },
      { input: '(]', output: false },
      { input: '([)]', output: false },
      { input: '{[]}', output: true }
    ],
    solution: {
      python: `def isValid(s):
    stack = []
    brackets = {')': '(', '}': '{', ']': '['}
    
    for char in s:
        if char in '({[':
            stack.append(char)
        else:
            if not stack or stack.pop() != brackets[char]:
                return False
    
    return len(stack) == 0`,
      javascript: `function isValid(s) {
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
      java: `public boolean isValid(String s) {
    Stack<Character> stack = new Stack<>();
    Map<Character, Character> brackets = Map.of(')', '(', '}', '{', ']', '[');
    
    for (char c : s.toCharArray()) {
        if ("({[".indexOf(c) != -1) {
            stack.push(c);
        } else {
            if (stack.isEmpty() || stack.pop() != brackets.get(c)) {
                return false;
            }
        }
    }
    
    return stack.isEmpty();
}`
    },
    stats: {
      totalSubmissions: 980,
      acceptedSubmissions: 720,
      acceptanceRate: 73.5
    }
  },
  {
    id: 3,
    title: 'Maximum Subarray',
    difficulty: 'medium',
    topics: ['array', 'dynamic-programming'],
    description: `Given an integer array nums, find the subarray with the largest sum, and return its sum.`,
    examples: [
      {
        input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
        output: '6',
        explanation: 'The subarray [4,-1,2,1] has the largest sum 6.'
      },
      {
        input: 'nums = [1]',
        output: '1',
        explanation: 'The subarray [1] has the largest sum 1.'
      }
    ],
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4'
    ],
    testCases: [
      { input: [-2, 1, -3, 4, -1, 2, 1, -5, 4], output: 6 },
      { input: [1], output: 1 },
      { input: [5, 4, -1, 7, 8], output: 23 }
    ],
    solution: {
      python: `def maxSubArray(nums):
    max_sum = current_sum = nums[0]
    
    for num in nums[1:]:
        current_sum = max(num, current_sum + num)
        max_sum = max(max_sum, current_sum)
    
    return max_sum`,
      javascript: `function maxSubArray(nums) {
    let maxSum = currentSum = nums[0];
    
    for (let i = 1; i < nums.length; i++) {
        currentSum = Math.max(nums[i], currentSum + nums[i]);
        maxSum = Math.max(maxSum, currentSum);
    }
    
    return maxSum;
}`,
      java: `public int maxSubArray(int[] nums) {
    int maxSum = nums[0];
    int currentSum = nums[0];
    
    for (int i = 1; i < nums.length; i++) {
        currentSum = Math.max(nums[i], currentSum + nums[i]);
        maxSum = Math.max(maxSum, currentSum);
    }
    
    return maxSum;
}`
    },
    stats: {
      totalSubmissions: 750,
      acceptedSubmissions: 520,
      acceptanceRate: 69.3
    }
  }
];

// @route   GET /api/problems
// @desc    Get all problems with filtering and pagination
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('difficulty').optional().isIn(['easy', 'medium', 'hard']).withMessage('Invalid difficulty level'),
  query('topic').optional().isString().withMessage('Topic must be a string'),
  query('search').optional().isString().withMessage('Search must be a string'),
  query('sort').optional().isIn(['title', 'difficulty', 'acceptance']).withMessage('Invalid sort field')
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

  const { 
    page = 1, 
    limit = 20, 
    difficulty, 
    topic, 
    search, 
    sort = 'title' 
  } = req.query;

  let filteredProblems = [...problems];

  // Apply filters
  if (difficulty) {
    filteredProblems = filteredProblems.filter(p => p.difficulty === difficulty);
  }

  if (topic) {
    filteredProblems = filteredProblems.filter(p => 
      p.topics.some(t => t.toLowerCase().includes(topic.toLowerCase()))
    );
  }

  if (search) {
    const searchLower = search.toLowerCase();
    filteredProblems = filteredProblems.filter(p => 
      p.title.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower) ||
      p.topics.some(t => t.toLowerCase().includes(searchLower))
    );
  }

  // Apply sorting
  switch (sort) {
    case 'difficulty':
      const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
      filteredProblems.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
      break;
    case 'acceptance':
      filteredProblems.sort((a, b) => b.stats.acceptanceRate - a.stats.acceptanceRate);
      break;
    default: // title
      filteredProblems.sort((a, b) => a.title.localeCompare(b.title));
  }

  // Apply pagination
  const offset = (page - 1) * limit;
  const paginatedProblems = filteredProblems.slice(offset, offset + parseInt(limit));

  res.json({
    success: true,
    problems: paginatedProblems.map(p => ({
      id: p.id,
      title: p.title,
      difficulty: p.difficulty,
      topics: p.topics,
      description: p.description,
      examples: p.examples,
      constraints: p.constraints,
      stats: p.stats
    })),
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: filteredProblems.length,
      totalPages: Math.ceil(filteredProblems.length / limit)
    }
  });
}));

// @route   GET /api/problems/:id
// @desc    Get problem by ID
// @access  Public
router.get('/:id', asyncHandler(async (req, res) => {
  const problemId = parseInt(req.params.id);
  const problem = problems.find(p => p.id === problemId);

  if (!problem) {
    return res.status(404).json({
      success: false,
      error: { message: 'Problem not found' }
    });
  }

  res.json({
    success: true,
    problem
  });
}));

// @route   GET /api/problems/:id/solution
// @desc    Get problem solution (for authenticated users)
// @access  Private
router.get('/:id/solution', asyncHandler(async (req, res) => {
  const problemId = parseInt(req.params.id);
  const problem = problems.find(p => p.id === problemId);

  if (!problem) {
    return res.status(404).json({
      success: false,
      error: { message: 'Problem not found' }
    });
  }

  res.json({
    success: true,
    solution: problem.solution
  });
}));

// @route   GET /api/problems/topics
// @desc    Get all available topics
// @access  Public
router.get('/topics', asyncHandler(async (req, res) => {
  const topics = [...new Set(problems.flatMap(p => p.topics))].sort();
  
  res.json({
    success: true,
    topics
  });
}));

module.exports = router;


