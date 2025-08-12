'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'
import { motion } from 'framer-motion'
import { 
  Code, 
  Search, 
  Filter, 
  TrendingUp, 
  Target, 
  Trophy,
  CheckCircle,
  Clock,
  Users
} from 'lucide-react'
import Link from 'next/link'
import { Problem, ProblemFilter } from '@/types/problem'

export default function ProblemsPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [problems, setProblems] = useState<Problem[]>([])
  const [filteredProblems, setFilteredProblems] = useState<Problem[]>([])
  const [filters, setFilters] = useState<ProblemFilter>({
    difficulty: undefined,
    topics: [],
    status: undefined,
    search: '',
    sortBy: 'difficulty',
    sortOrder: 'asc'
  })
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
      return
    }

    if (user) {
      fetchProblems()
    }
  }, [user, loading, router])

  useEffect(() => {
    applyFilters()
  }, [filters, problems])

  const fetchProblems = async () => {
    setIsLoading(true)
    try {
      // In a real app, this would fetch from your API
      // For now, using mock data
      const mockProblems: Problem[] = [
        {
          id: '1',
          title: 'Two Sum',
          description: 'Find two numbers that add up to a target value',
          difficulty: 'easy',
          topics: ['Array', 'Hash Table'],
          constraints: ['2 <= nums.length <= 10^4'],
          examples: [],
          testCases: [],
          starterCode: {},
          solution: {},
          hints: [],
          timeLimit: 2,
          memoryLimit: 128,
          points: 10,
          submissions: 1250,
          acceptanceRate: 85.2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '2',
          title: 'Add Two Numbers',
          description: 'Add two numbers represented by linked lists',
          difficulty: 'medium',
          topics: ['Linked List', 'Math'],
          constraints: ['1 <= number of nodes <= 100'],
          examples: [],
          testCases: [],
          starterCode: {},
          solution: {},
          hints: [],
          timeLimit: 3,
          memoryLimit: 256,
          points: 20,
          submissions: 890,
          acceptanceRate: 72.1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '3',
          title: 'Longest Substring Without Repeating Characters',
          description: 'Find the length of the longest substring without repeating characters',
          difficulty: 'medium',
          topics: ['String', 'Sliding Window'],
          constraints: ['0 <= s.length <= 5 * 10^4'],
          examples: [],
          testCases: [],
          starterCode: {},
          solution: {},
          hints: [],
          timeLimit: 3,
          memoryLimit: 256,
          points: 25,
          submissions: 650,
          acceptanceRate: 68.5,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '4',
          title: 'Median of Two Sorted Arrays',
          description: 'Find the median of two sorted arrays',
          difficulty: 'hard',
          topics: ['Array', 'Binary Search'],
          constraints: ['nums1.length + nums2.length >= 1'],
          examples: [],
          testCases: [],
          starterCode: {},
          solution: {},
          hints: [],
          timeLimit: 5,
          memoryLimit: 512,
          points: 40,
          submissions: 320,
          acceptanceRate: 45.2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '5',
          title: 'Valid Parentheses',
          description: 'Check if a string of parentheses is valid',
          difficulty: 'easy',
          topics: ['String', 'Stack'],
          constraints: ['1 <= s.length <= 10^4'],
          examples: [],
          testCases: [],
          starterCode: {},
          solution: {},
          hints: [],
          timeLimit: 2,
          memoryLimit: 128,
          points: 15,
          submissions: 1100,
          acceptanceRate: 78.9,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
      
      setProblems(mockProblems)
    } catch (error) {
      console.error('Failed to fetch problems:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...problems]

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(problem =>
        problem.title.toLowerCase().includes(filters.search!.toLowerCase()) ||
        problem.description.toLowerCase().includes(filters.search!.toLowerCase()) ||
        problem.topics.some(topic => topic.toLowerCase().includes(filters.search!.toLowerCase()))
      )
    }

    // Difficulty filter
    if (filters.difficulty) {
      filtered = filtered.filter(problem => problem.difficulty === filters.difficulty)
    }

    // Topics filter
    if (filters.topics.length > 0) {
      filtered = filtered.filter(problem =>
        filters.topics!.some(topic => problem.topics.includes(topic))
      )
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any, bValue: any
      
      switch (filters.sortBy) {
        case 'difficulty':
          const difficultyOrder = { easy: 1, medium: 2, hard: 3 }
          aValue = difficultyOrder[a.difficulty as keyof typeof difficultyOrder]
          bValue = difficultyOrder[b.difficulty as keyof typeof difficultyOrder]
          break
        case 'points':
          aValue = a.points
          bValue = b.points
          break
        case 'submissions':
          aValue = a.submissions
          bValue = b.submissions
          break
        case 'acceptance_rate':
          aValue = a.acceptanceRate
          bValue = b.acceptanceRate
          break
        default:
          aValue = a.title
          bValue = b.title
      }

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredProblems(filtered)
  }

  const handleFilterChange = (key: keyof ProblemFilter, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      difficulty: undefined,
      topics: [],
      status: undefined,
      search: '',
      sortBy: 'difficulty',
      sortOrder: 'asc'
    })
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-success-100 text-success-800'
      case 'medium': return 'bg-warning-100 text-warning-800'
      case 'hard': return 'bg-error-100 text-error-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading problems...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const availableTopics = Array.from(new Set(problems.flatMap(p => p.topics)))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Code className="w-8 h-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">CodeAI</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user.username}!</span>
              <Link href="/dashboard" className="btn-secondary">Dashboard</Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Coding Problems</h1>
          <p className="text-gray-600">
            Practice with our curated collection of coding challenges. Improve your skills and climb the leaderboard!
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search problems by title, description, or topics..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>

            {/* Sort */}
            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-')
                handleFilterChange('sortBy', sortBy)
                handleFilterChange('sortOrder', sortOrder)
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="difficulty-asc">Difficulty (Easy to Hard)</option>
              <option value="difficulty-desc">Difficulty (Hard to Easy)</option>
              <option value="points-asc">Points (Low to High)</option>
              <option value="points-desc">Points (High to Low)</option>
              <option value="submissions-desc">Most Popular</option>
              <option value="acceptance_rate-desc">Highest Success Rate</option>
            </select>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Difficulty Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                  <div className="space-y-2">
                    {['easy', 'medium', 'hard'].map((diff) => (
                      <label key={diff} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.difficulty === diff}
                          onChange={(e) => handleFilterChange('difficulty', e.target.checked ? diff : undefined)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">{diff}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Topics Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Topics</label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {availableTopics.map((topic) => (
                      <label key={topic} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.topics.includes(topic)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleFilterChange('topics', [...filters.topics, topic])
                            } else {
                              handleFilterChange('topics', filters.topics.filter(t => t !== topic))
                            }
                          }}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{topic}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <div className="space-y-2">
                    {['solved', 'attempted', 'unsolved'].map((status) => (
                      <label key={status} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.status === status}
                          onChange={(e) => handleFilterChange('status', e.target.checked ? status : undefined)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">{status}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Problems Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading problems...</p>
          </div>
        ) : filteredProblems.length === 0 ? (
          <div className="text-center py-12">
            <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No problems found</h3>
            <p className="text-gray-600">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProblems.map((problem, index) => (
              <motion.div
                key={problem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {problem.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {problem.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {problem.topics.slice(0, 3).map((topic) => (
                      <span key={topic} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {topic}
                      </span>
                    ))}
                    {problem.topics.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        +{problem.topics.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Trophy className="w-4 h-4 mr-1" />
                        {problem.points} pts
                      </span>
                      <span className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {problem.submissions}
                      </span>
                    </div>
                    <span className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      {problem.acceptanceRate}%
                    </span>
                  </div>

                  <Link
                    href={`/problems/${problem.id}`}
                    className="w-full btn-primary text-center"
                  >
                    Start Solving
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Results Summary */}
        {filteredProblems.length > 0 && (
          <div className="mt-8 text-center text-sm text-gray-600">
            Showing {filteredProblems.length} of {problems.length} problems
          </div>
        )}
      </div>
    </div>
  )
}
