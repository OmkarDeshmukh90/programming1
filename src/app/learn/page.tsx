'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Target, 
  Play, 
  CheckCircle, 
  Clock, 
  Star,
  TrendingUp,
  Brain,
  ArrowRight,
  Lock,
  Unlock
} from 'lucide-react'
import Link from 'next/link'

interface LearningPath {
  id: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: string
  topics: string[]
  problems: number
  completed: number
  isLocked: boolean
  progress: number
  nextProblem?: string
}

interface Topic {
  id: string
  name: string
  description: string
  problems: number
  completed: number
  difficulty: 'easy' | 'medium' | 'hard'
}

export default function LearningPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [selectedPath, setSelectedPath] = useState<string | null>(null)
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([])
  const [topics, setTopics] = useState<Topic[]>([])
  const [recommendations, setRecommendations] = useState<any[]>([])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
      return
    }

    fetchLearningData()
  }, [user, loading, router])

  const fetchLearningData = async () => {
    // Mock data - replace with actual API calls
    const mockPaths: LearningPath[] = [
      {
        id: 'arrays-basics',
        title: 'Array Fundamentals',
        description: 'Master the basics of array manipulation and common algorithms',
        difficulty: 'beginner',
        duration: '2-3 weeks',
        topics: ['Arrays', 'Two Pointers', 'Sliding Window'],
        problems: 15,
        completed: 8,
        isLocked: false,
        progress: 53,
        nextProblem: 'Two Sum'
      },
      {
        id: 'dynamic-programming',
        title: 'Dynamic Programming',
        description: 'Learn to solve complex problems using dynamic programming techniques',
        difficulty: 'advanced',
        duration: '4-6 weeks',
        topics: ['DP', 'Memoization', 'Tabulation'],
        problems: 20,
        completed: 3,
        isLocked: false,
        progress: 15,
        nextProblem: 'Climbing Stairs'
      },
      {
        id: 'tree-algorithms',
        title: 'Tree Data Structures',
        description: 'Explore tree traversal and common tree-based algorithms',
        difficulty: 'intermediate',
        duration: '3-4 weeks',
        topics: ['Trees', 'DFS', 'BFS'],
        problems: 12,
        completed: 0,
        isLocked: true,
        progress: 0
      },
      {
        id: 'graph-algorithms',
        title: 'Graph Algorithms',
        description: 'Master graph traversal and pathfinding algorithms',
        difficulty: 'advanced',
        duration: '4-5 weeks',
        topics: ['Graphs', 'Shortest Path', 'Topological Sort'],
        problems: 18,
        completed: 0,
        isLocked: true,
        progress: 0
      }
    ]

    const mockTopics: Topic[] = [
      { id: 'arrays', name: 'Arrays', description: 'Array manipulation and algorithms', problems: 25, completed: 12, difficulty: 'easy' },
      { id: 'strings', name: 'Strings', description: 'String processing and manipulation', problems: 20, completed: 8, difficulty: 'easy' },
      { id: 'linked-lists', name: 'Linked Lists', description: 'Linked list operations and algorithms', problems: 15, completed: 5, difficulty: 'medium' },
      { id: 'trees', name: 'Trees', description: 'Tree traversal and algorithms', problems: 18, completed: 3, difficulty: 'medium' },
      { id: 'dp', name: 'Dynamic Programming', description: 'DP techniques and optimization', problems: 30, completed: 6, difficulty: 'hard' },
      { id: 'graphs', name: 'Graphs', description: 'Graph algorithms and traversal', problems: 22, completed: 2, difficulty: 'hard' }
    ]

    const mockRecommendations = [
      {
        id: 1,
        title: 'Two Sum',
        difficulty: 'easy',
        topic: 'Arrays',
        reason: 'Perfect for your current level',
        estimatedTime: '15 min'
      },
      {
        id: 2,
        title: 'Valid Parentheses',
        difficulty: 'easy',
        topic: 'Stacks',
        reason: 'Builds on your array knowledge',
        estimatedTime: '20 min'
      },
      {
        id: 3,
        title: 'Maximum Subarray',
        difficulty: 'medium',
        topic: 'Dynamic Programming',
        reason: 'Next step in your learning path',
        estimatedTime: '30 min'
      }
    ]

    setLearningPaths(mockPaths)
    setTopics(mockTopics)
    setRecommendations(mockRecommendations)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
      case 'easy':
        return 'bg-success-100 text-success-800'
      case 'intermediate':
      case 'medium':
        return 'bg-warning-100 text-warning-800'
      case 'advanced':
      case 'hard':
        return 'bg-error-100 text-error-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
      case 'easy':
        return '🟢'
      case 'intermediate':
      case 'medium':
        return '🟡'
      case 'advanced':
      case 'hard':
        return '🔴'
      default:
        return '⚪'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="flex items-center text-gray-600 hover:text-gray-900">
                ← Back to Dashboard
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <BookOpen className="w-6 h-6 text-primary-600" />
              <span className="text-lg font-bold text-gray-900">Learning Paths</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* AI Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="card mb-8 bg-gradient-to-r from-primary-50 to-purple-50 border-primary-200"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Brain className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">AI Recommendations</h2>
          </div>
          <p className="text-gray-600 mb-6">
            Based on your progress and skill level, here are the best problems to tackle next:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendations.map((rec, index) => (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{rec.title}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(rec.difficulty)}`}>
                    {rec.difficulty}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{rec.topic}</p>
                <p className="text-xs text-gray-500 mb-3">{rec.reason}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {rec.estimatedTime}
                  </span>
                  <Link href={`/problems/${rec.id}`} className="btn-primary text-xs px-3 py-1">
                    Start
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Learning Paths */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Learning Paths</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {learningPaths.map((path, index) => (
              <motion.div
                key={path.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`card relative ${path.isLocked ? 'opacity-75' : 'hover:shadow-lg'} transition-all duration-300`}
              >
                {path.isLocked && (
                  <div className="absolute inset-0 bg-gray-900 bg-opacity-50 rounded-lg flex items-center justify-center">
                    <Lock className="w-8 h-8 text-white" />
                  </div>
                )}
                
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{path.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{path.description}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(path.difficulty)}`}>
                    {getDifficultyIcon(path.difficulty)} {path.difficulty}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{path.completed}/{path.problems} problems</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${path.progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {path.duration}
                    </span>
                    <span className="flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      {path.topics.length} topics
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {path.topics.slice(0, 3).map((topic) => (
                      <span key={topic} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {topic}
                      </span>
                    ))}
                    {path.topics.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        +{path.topics.length - 3} more
                      </span>
                    )}
                  </div>

                  {path.nextProblem && !path.isLocked && (
                    <div className="mt-4 p-3 bg-success-50 border border-success-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-success-800">Next Problem</p>
                          <p className="text-sm text-success-600">{path.nextProblem}</p>
                        </div>
                        <Link href={`/problems/${path.id}`} className="btn-success text-sm px-3 py-1">
                          Continue
                        </Link>
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2 mt-4">
                    {!path.isLocked ? (
                      <button
                        onClick={() => setSelectedPath(path.id)}
                        className="btn-primary flex-1 flex items-center justify-center"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Start Path
                      </button>
                    ) : (
                      <button className="btn-secondary flex-1 flex items-center justify-center opacity-50 cursor-not-allowed">
                        <Lock className="w-4 h-4 mr-2" />
                        Locked
                      </button>
                    )}
                    <button className="btn-secondary px-3">
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Topic Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Topic Breakdown</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic, index) => (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="card hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => router.push(`/problems?topic=${topic.id}`)}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{topic.name}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(topic.difficulty)}`}>
                    {topic.difficulty}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4">{topic.description}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{topic.completed}/{topic.problems}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(topic.completed / topic.problems) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {topic.completed === topic.problems ? (
                      <span className="flex items-center text-success-600">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Completed
                      </span>
                    ) : (
                      `${topic.problems - topic.completed} remaining`
                    )}
                  </span>
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
