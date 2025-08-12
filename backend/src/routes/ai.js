const express = require('express');
const { body, validationResult } = require('express-validator');
const { asyncHandler } = require('../middleware/errorHandler');
const { HfInference } = require('@huggingface/inference');

const router = express.Router();

// Initialize Hugging Face client
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// Models for different tasks
const MODELS = {
  // Natural Language Explanations
  EXPLANATION: 'meta-llama/Llama-2-7b-chat-hf', // or 'mistralai/Mistral-7B-Instruct-v0.2'
  
  // Code Feedback
  CODE_FEEDBACK: 'bigcode/starcoder2-15b', // or 'codellama/CodeLlama-7b-hf'
  
  // Alternative models if primary ones are unavailable
  FALLBACK_EXPLANATION: 'microsoft/DialoGPT-medium',
  FALLBACK_CODE: 'microsoft/DialoGPT-medium'
};

// Validation middleware
const validateCodeFeedback = [
  body('code')
    .notEmpty()
    .withMessage('Code is required'),
  body('language')
    .isIn(['python', 'javascript', 'java', 'cpp', 'c'])
    .withMessage('Invalid programming language'),
  body('problemDescription')
    .notEmpty()
    .withMessage('Problem description is required')
];

const validateProblemExplanation = [
  body('problemDescription')
    .notEmpty()
    .withMessage('Problem description is required'),
  body('difficulty')
    .isIn(['easy', 'medium', 'hard'])
    .withMessage('Invalid difficulty level')
];

// Helper function to call Hugging Face API with fallback
async function callHuggingFaceAPI(model, prompt, fallbackModel = null) {
  try {
    const response = await hf.textGeneration({
      model: model,
      inputs: prompt,
      parameters: {
        max_new_tokens: 500,
        temperature: 0.3,
        top_p: 0.9,
        do_sample: true
      }
    });
    return response.generated_text;
  } catch (error) {
    console.error(`Error with model ${model}:`, error);
    
    if (fallbackModel && fallbackModel !== model) {
      try {
        console.log(`Trying fallback model: ${fallbackModel}`);
        const fallbackResponse = await hf.textGeneration({
          model: fallbackModel,
          inputs: prompt,
          parameters: {
            max_new_tokens: 300,
            temperature: 0.3,
            top_p: 0.9,
            do_sample: true
          }
        });
        return fallbackResponse.generated_text;
      } catch (fallbackError) {
        console.error(`Fallback model also failed:`, fallbackError);
        throw error;
      }
    }
    throw error;
  }
}

// @route   POST /api/ai/code-feedback
// @desc    Get AI-powered feedback on code using StarCoder 2
// @access  Private
router.post('/code-feedback', validateCodeFeedback, asyncHandler(async (req, res) => {
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

  const { code, language, problemDescription, testResults } = req.body;

  try {
    // Create prompt for code analysis
    const prompt = `Analyze this ${language} code for the given problem and provide feedback:

Problem: ${problemDescription}

Code:
\`\`\`${language}
${code}
\`\`\`

${testResults ? `Test Results: ${JSON.stringify(testResults)}` : ''}

Provide:
1. Code quality score (0-100)
2. 3-5 specific suggestions for improvement
3. 2-3 areas that need improvement
4. Overall assessment

Format as JSON:
{
  "score": number,
  "suggestions": ["suggestion1", "suggestion2"],
  "improvements": ["improvement1", "improvement2"],
  "assessment": "overall assessment"
}`;

    const feedbackText = await callHuggingFaceAPI(
      MODELS.CODE_FEEDBACK, 
      prompt, 
      MODELS.FALLBACK_CODE
    );
    
    // Try to parse JSON response, fallback to structured text if needed
    let feedback;
    try {
      // Extract JSON from the response (models might add extra text)
      const jsonMatch = feedbackText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        feedback = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      // Fallback: create structured feedback from text
      feedback = {
        score: 75,
        suggestions: [
          "Consider adding more comments to explain complex logic",
          "Review variable naming conventions",
          "Check for potential edge cases"
        ],
        improvements: [
          "Code structure could be more modular",
          "Consider error handling for edge cases"
        ],
        assessment: feedbackText || "Code analysis completed. Review the suggestions for improvement."
      };
    }

    res.json({
      success: true,
      feedback
    });

  } catch (error) {
    console.error('AI API error:', error);
    
    // Fallback feedback when AI service is unavailable
    const fallbackFeedback = {
      score: 70,
      suggestions: [
        "Review your code for syntax errors",
        "Check if your solution handles all test cases",
        "Consider the time and space complexity of your approach"
      ],
      improvements: [
        "Code could benefit from better variable naming",
        "Consider adding input validation"
      ],
      assessment: "Code analysis completed. Focus on the suggested improvements to enhance your solution."
    };

    res.json({
      success: true,
      feedback: fallbackFeedback,
      note: "AI feedback service temporarily unavailable, showing general suggestions"
    });
  }
}));

// @route   POST /api/ai/problem-explanation
// @desc    Get AI-generated explanation using LLaMA 3 / Mistral
// @access  Private
router.post('/problem-explanation', validateProblemExplanation, asyncHandler(async (req, res) => {
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

  const { problemDescription, difficulty, topics } = req.body;

  try {
    const prompt = `Explain this coding problem in simple, easy-to-understand terms:

Problem: ${problemDescription}
Difficulty: ${difficulty}
Topics: ${topics ? topics.join(', ') : 'Not specified'}

Provide:
1. A clear, simple explanation of what the problem is asking
2. Key concepts and approaches to consider
3. Common pitfalls to avoid
4. A step-by-step approach to solve it
5. Real-world analogy if applicable

Make the explanation beginner-friendly and focus on understanding the problem rather than providing the solution.`;

    const explanation = await callHuggingFaceAPI(
      MODELS.EXPLANATION, 
      prompt, 
      MODELS.FALLBACK_EXPLANATION
    );

    res.json({
      success: true,
      explanation
    });

  } catch (error) {
    console.error('AI API error:', error);
    
    // Fallback explanation
    const fallbackExplanation = `This is a ${difficulty} level coding problem that tests your understanding of ${topics ? topics.join(', ') : 'programming fundamentals'}.

Key points to understand:
- Read the problem carefully and identify the input/output requirements
- Consider edge cases and constraints mentioned
- Think about the most efficient approach before coding
- Test your solution with the provided examples

Take your time to understand the problem before jumping into coding.`;

    res.json({
      success: true,
      explanation: fallbackExplanation,
      note: "AI explanation service temporarily unavailable, showing general guidance"
    });
  }
}));

// @route   POST /api/ai/hint-generator
// @desc    Generate contextual hints using LLaMA 3 / Mistral
// @access  Private
router.post('/hint-generator', asyncHandler(async (req, res) => {
  const { problemDescription, userProgress, currentApproach } = req.body;

  try {
    const prompt = `Generate 2-3 helpful hints for a student working on this coding problem:

Problem: ${problemDescription}
User's Current Approach: ${currentApproach || 'Not specified'}
User's Progress: ${userProgress || 'Just starting'}

Provide hints that:
1. Guide without giving away the solution
2. Are appropriate for the user's current progress
3. Help them think about the problem differently
4. Point out common misconceptions

Format as a JSON array of hint strings.`;

    const hintsText = await callHuggingFaceAPI(
      MODELS.EXPLANATION, 
      prompt, 
      MODELS.FALLBACK_EXPLANATION
    );
    
    let hints;
    try {
      // Extract JSON array from the response
      const jsonMatch = hintsText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        hints = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON array found in response');
      }
    } catch (parseError) {
      hints = [
        "Think about the data structure that would be most efficient for this problem",
        "Consider what information you need to track as you process the input",
        "Look for patterns in the examples that might suggest an algorithm"
      ];
    }

    res.json({
      success: true,
      hints
    });

  } catch (error) {
    console.error('AI API error:', error);
    
    // Fallback hints
    const fallbackHints = [
      "Break down the problem into smaller, manageable parts",
      "Consider what data structures would be most helpful",
      "Think about the time and space complexity of different approaches"
    ];

    res.json({
      success: true,
      hints: fallbackHints,
      note: "AI hint service temporarily unavailable, showing general hints"
    });
  }
}));

// @route   POST /api/ai/learning-path
// @desc    Generate personalized learning path using local recommendation engine
// @access  Private
router.post('/learning-path', asyncHandler(async (req, res) => {
  const { userSkills, solvedProblems, targetTopics } = req.body;

  try {
    // Simple recommendation engine using local logic
    const learningPath = generateLearningPath(userSkills, solvedProblems, targetTopics);

    res.json({
      success: true,
      learningPath
    });

  } catch (error) {
    console.error('Learning path generation error:', error);
    
    // Fallback learning path
    const fallbackPath = {
      nextProblems: ["Two Sum", "Valid Parentheses", "Maximum Subarray"],
      focusTopics: ["Arrays", "Hash Tables", "Dynamic Programming"],
      learningResources: ["Array manipulation techniques", "Hash table applications", "Basic DP concepts"],
      timeline: "2-3 weeks for solid foundation"
    };

    res.json({
      success: true,
      learningPath: fallbackPath,
      note: "Learning path service temporarily unavailable, showing general recommendations"
    });
  }
}));

// Local recommendation engine using simple logic
function generateLearningPath(userSkills, solvedProblems, targetTopics) {
  // Define problem categories and difficulty progression
  const problemCategories = {
    'arrays': {
      easy: ['Two Sum', 'Remove Duplicates', 'Find Missing Number'],
      medium: ['Maximum Subarray', 'Container With Most Water', '3Sum'],
      hard: ['Trapping Rain Water', 'Maximum Product Subarray', 'Subarray Sum Equals K']
    },
    'strings': {
      easy: ['Valid Parentheses', 'Palindrome Check', 'Reverse String'],
      medium: ['Longest Substring Without Repeating Characters', 'Group Anagrams', 'Valid Anagram'],
      hard: ['Longest Palindromic Substring', 'Regular Expression Matching', 'Minimum Window Substring']
    },
    'linked-lists': {
      easy: ['Reverse Linked List', 'Detect Cycle', 'Merge Two Lists'],
      medium: ['Add Two Numbers', 'Remove Nth Node', 'Reorder List'],
      hard: ['Merge K Sorted Lists', 'Reverse Nodes in K-Group', 'Copy List with Random Pointer']
    },
    'trees': {
      easy: ['Maximum Depth', 'Symmetric Tree', 'Path Sum'],
      medium: ['Binary Tree Level Order Traversal', 'Construct Binary Tree', 'Lowest Common Ancestor'],
      hard: ['Serialize and Deserialize', 'Binary Tree Maximum Path Sum', 'Recover Binary Search Tree']
    },
    'dynamic-programming': {
      easy: ['Climbing Stairs', 'Fibonacci Number', 'Min Cost Climbing Stairs'],
      medium: ['House Robber', 'Coin Change', 'Longest Increasing Subsequence'],
      hard: ['Edit Distance', 'Regular Expression Matching', 'Wildcard Matching']
    }
  };

  // Analyze user's current level
  const solvedCount = solvedProblems ? solvedProblems.length : 0;
  let userLevel = 'easy';
  if (solvedCount > 50) userLevel = 'hard';
  else if (solvedCount > 20) userLevel = 'medium';

  // Determine focus topics
  let focusTopics = targetTopics || ['arrays', 'strings'];
  if (!targetTopics && userSkills) {
    // Analyze user skills to determine weak areas
    const skillLevels = Object.values(userSkills || {});
    const avgSkill = skillLevels.reduce((sum, skill) => sum + skill, 0) / skillLevels.length;
    
    if (avgSkill < 3) {
      focusTopics = ['arrays', 'strings'];
    } else if (avgSkill < 5) {
      focusTopics = ['linked-lists', 'trees'];
    } else {
      focusTopics = ['dynamic-programming', 'graphs'];
    }
  }

  // Generate next problems
  const nextProblems = [];
  focusTopics.forEach(topic => {
    if (problemCategories[topic]) {
      const problems = problemCategories[topic][userLevel] || problemCategories[topic]['easy'];
      nextProblems.push(...problems.slice(0, 2)); // Take first 2 problems from each topic
    }
  });

  // Generate learning resources
  const learningResources = focusTopics.map(topic => {
    const resources = {
      'arrays': 'Array manipulation techniques and two-pointer approach',
      'strings': 'String manipulation and character counting',
      'linked-lists': 'Linked list traversal and pointer manipulation',
      'trees': 'Tree traversal (DFS/BFS) and recursive thinking',
      'dynamic-programming': 'Memoization and tabulation techniques',
      'graphs': 'Graph traversal algorithms (DFS/BFS)'
    };
    return resources[topic] || `${topic} fundamentals`;
  });

  // Estimate timeline
  const timeline = userLevel === 'easy' ? '1-2 weeks' : 
                  userLevel === 'medium' ? '2-3 weeks' : '3-4 weeks';

  return {
    nextProblems: nextProblems.slice(0, 5), // Limit to 5 problems
    focusTopics,
    learningResources,
    timeline
  };
}

module.exports = router;


