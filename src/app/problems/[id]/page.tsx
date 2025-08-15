'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'
import { motion } from 'framer-motion'
import { 
  Code, 
  ArrowLeft, 
  Brain, 
  Lightbulb, 
  Clock, 
  Target, 
  Trophy,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import CodeEditor from '@/components/CodeEditor'
import VideoExplanations from '@/components/VideoExplanations'
import { Problem } from '@/types/problem'
import toast from 'react-hot-toast'

export default function ProblemPage() {
  const params = useParams()
  const router = useRouter()
  const { user, loading } = useAuth()
  const [problem, setProblem] = useState<Problem | null>(null)
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('python')
  const [isRunning, setIsRunning] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isGettingAIFeedback, setIsGettingAIFeedback] = useState(false)
  const [testResults, setTestResults] = useState<any>(null)
  const [aiFeedback, setAiFeedback] = useState<any>(null)
  const [showHints, setShowHints] = useState(false)
  const [showSolution, setShowSolution] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
      return
    }

    if (params.id) {
      fetchProblem(params.id as string)
    }
  }, [params.id, user, loading, router])

  const fetchProblem = async (id: string) => {
    try {
      // In a real app, this would fetch from your API
      // For now, using mock data
      const mockProblem: Problem = {
        id,
        title: 'Two Sum',
        description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
        difficulty: 'easy',
        topics: ['Array', 'Hash Table'],
        constraints: [
          '2 <= nums.length <= 10^4',
          '-10^9 <= nums[i] <= 10^9',
          '-10^9 <= target <= 10^9',
          'Only one valid answer exists.'
        ],
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
        testCases: [
          { id: '1', input: '[2,7,11,15]\n9', expectedOutput: '[0,1]', isHidden: false },
          { id: '2', input: '[3,2,4]\n6', expectedOutput: '[1,2]', isHidden: false },
          { id: '3', input: '[3,3]\n6', expectedOutput: '[0,1]', isHidden: false }
        ],
        starterCode: {
          python: `def twoSum(nums, target):
    # Your code here
    pass`,
          javascript: `function twoSum(nums, target) {
    // Your code here
}`,
          java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your code here
        return new int[]{};
    }
}`
        },
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
          java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (seen.containsKey(complement)) {
                return new int[]{seen.get(complement), i};
            }
            seen.put(nums[i], i);
        }
        return new int[]{};
    }
}`
        },
        hints: [
          'Try using a hash table to store numbers you have seen',
          'For each number, check if its complement (target - number) exists in the hash table',
          'This approach gives you O(n) time complexity'
        ],
        timeLimit: 2,
        memoryLimit: 128,
        points: 10,
        submissions: 1250,
        acceptanceRate: 85.2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      setProblem(mockProblem)
      setCode(mockProblem.starterCode[language] || '')
    } catch (error) {
      console.error('Failed to fetch problem:', error)
      toast.error('Failed to load problem')
    }
  }

  const handleCodeChange = (newCode: string) => {
    setCode(newCode)
  }

  const handleRunCode = async () => {
    if (!code.trim()) {
      toast.error('Please write some code first')
      return
    }

    setIsRunning(true)
    try {
      // Simulate code execution
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock test results
      const results = {
        passed: 2,
        total: 3,
        details: [
          {
            testCase: '[2,7,11,15], target=9',
            expected: '[0,1]',
            actual: '[0,1]',
            passed: true
          },
          {
            testCase: '[3,2,4], target=6',
            expected: '[1,2]',
            actual: '[1,2]',
            passed: true
          },
          {
            testCase: '[3,3], target=6',
            expected: '[0,1]',
            actual: '[0,1]',
            passed: true
          }
        ]
      }
      
      setTestResults(results)
      
      // Generate AI feedback
      const feedback = {
        suggestions: [
          'Consider adding input validation for edge cases',
          'Your solution has good time complexity O(n)',
          'The hash table approach is optimal for this problem'
        ],
        improvements: [
          'Add comments to explain the algorithm logic',
          'Consider handling the case where no solution exists'
        ],
        score: 85
      }
      
      setAiFeedback(feedback)
      toast.success('Code executed successfully!')
    } catch (error) {
      toast.error('Failed to run code')
    } finally {
      setIsRunning(false)
    }
  }

  const handleGetAIFeedback = async () => {
    if (!code.trim()) {
      toast.error('Please write some code first')
      return
    }

    setIsGettingAIFeedback(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No authentication token')
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/code-feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
                  body: JSON.stringify({
            code: code,
            language: language,
            problemDescription: problem?.description || '',
            testResults: testResults
          })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to get AI feedback')
      }

      setAiFeedback(data.feedback)
      toast.success('AI feedback generated successfully!')
    } catch (error) {
      console.error('AI feedback error:', error)
      toast.error('Failed to get AI feedback. Please try again.')
    } finally {
      setIsGettingAIFeedback(false)
    }
  }

  const handleSubmit = async () => {
    if (!code.trim()) {
      toast.error('Please write some code first')
      return
    }

    setIsSubmitted(true)
    try {
      // Simulate submission
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      if (testResults?.passed === testResults?.total) {
        toast.success('Congratulations! All tests passed! 🎉')
        // Update user stats, award points, etc.
      } else {
        toast.error('Some tests failed. Please review your solution.')
      }
    } catch (error) {
      toast.error('Failed to submit solution')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading problem...</p>
        </div>
      </div>
    )
  }

  if (!user || !problem) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/problems" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Problems
              </Link>
              <div className="flex items-center space-x-2">
                <Code className="w-6 h-6 text-primary-600" />
                <span className="text-lg font-bold text-gray-900"></span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user.username}!</span>
              <Link href="/dashboard" className="btn-secondary">Dashboard</Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[600px]">
          {/* Problem Description */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 overflow-y-auto max-h-[80vh] lg:max-h-none lg:sticky lg:top-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900">{problem.title}</h1>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    problem.difficulty === 'easy' ? 'bg-success-100 text-success-800' :
                    problem.difficulty === 'medium' ? 'bg-warning-100 text-warning-800' :
                    'bg-error-100 text-error-800'
                  }`}>
                    {problem.difficulty}
                  </span>
                  <span className="flex items-center text-sm text-gray-600">
                    <Trophy className="w-4 h-4 mr-1" />
                    {problem.points} pts
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {problem.timeLimit}s
                </span>
                <span className="flex items-center">
                  <Target className="w-4 h-4 mr-1" />
                  {problem.memoryLimit}MB
                </span>
                <span className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  {problem.acceptanceRate}% acceptance
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {problem.topics.map((topic) => (
                  <span key={topic} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 whitespace-pre-line">{problem.description}</p>
                </div>
              </div>

              {/* Constraints */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Constraints</h3>
                <ul className="space-y-2">
                  {problem.constraints.map((constraint, index) => (
                    <li key={index} className="flex items-start text-sm text-gray-700">
                      <span className="text-gray-400 mr-2">•</span>
                      {constraint}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Examples */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Examples</h3>
                <div className="space-y-4">
                  {problem.examples.map((example, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm font-medium text-gray-700">Input:</span>
                          <pre className="mt-1 text-sm text-gray-800 bg-white p-2 rounded border">
                            {example.input}
                          </pre>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">Output:</span>
                          <pre className="mt-1 text-sm text-gray-800 bg-white p-2 rounded border">
                            {example.output}
                          </pre>
                        </div>
                      </div>
                      {example.explanation && (
                        <div className="mt-3">
                          <span className="text-sm font-medium text-gray-700">Explanation:</span>
                          <p className="mt-1 text-sm text-gray-600">{example.explanation}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Hints */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">Hints</h3>
                  <button
                    onClick={() => setShowHints(!showHints)}
                    className="flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    <Lightbulb className="w-4 h-4 mr-1" />
                    {showHints ? 'Hide' : 'Show'} Hints
                  </button>
                </div>
                {showHints && (
                  <div className="space-y-2">
                    {problem.hints.map((hint, index) => (
                      <div key={index} className="flex items-start p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <span className="text-yellow-600 mr-2">💡</span>
                        <span className="text-sm text-yellow-800">{hint}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Solution */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">Solution</h3>
                  <button
                    onClick={() => setShowSolution(!showSolution)}
                    className="flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    <Brain className="w-4 h-4 mr-1" />
                    {showSolution ? 'Hide' : 'Show'} Solution
                  </button>
                </div>
                {showSolution && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="text-sm text-gray-800 overflow-x-auto">
                      <code>{problem.solution[language]}</code>
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Code Editor */}
          <div className="min-h-[600px] lg:min-h-[700px]">
            <CodeEditor
              problem={problem}
              onCodeChange={handleCodeChange}
              onRunCode={handleRunCode}
              onSubmit={handleSubmit}
              onGetAIFeedback={handleGetAIFeedback}
              language={language}
              code={code}
              isRunning={isRunning}
              isSubmitted={isSubmitted}
              isGettingAIFeedback={isGettingAIFeedback}
              testResults={testResults}
              aiFeedback={aiFeedback}
            />
          </div>
        </div>
      </div>
      {/* Video explanations */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-8">
        <VideoExplanations problemId={String(params.id)} problemTitle={problem.title} />
      </div>
    </div>
  )
}
