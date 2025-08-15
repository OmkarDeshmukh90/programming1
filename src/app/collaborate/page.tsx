'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Users, 
  Plus, 
  Search, 
  Clock, 
  User, 
  Code,
  Play,
  Settings,
  Filter,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'

interface CodingSession {
  id: string
  title: string
  problem: string
  host: string
  participants: number
  maxParticipants: number
  status: 'waiting' | 'active' | 'completed'
  difficulty: 'easy' | 'medium' | 'hard'
  language: string
  createdAt: Date
  estimatedDuration: string
}

export default function CollaboratePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [sessions, setSessions] = useState<CodingSession[]>([])
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
      return
    }

    fetchSessions()
  }, [user, loading, router])

  const fetchSessions = async () => {
    // Mock data - replace with actual API call
    const mockSessions: CodingSession[] = [
      {
        id: '1',
        title: 'Two Sum - Beginner Friendly',
        problem: 'Two Sum',
        host: 'alice_coder',
        participants: 3,
        maxParticipants: 5,
        status: 'waiting',
        difficulty: 'easy',
        language: 'Python',
        createdAt: new Date(Date.now() - 300000), // 5 minutes ago
        estimatedDuration: '30 min'
      },
      {
        id: '2',
        title: 'Dynamic Programming Deep Dive',
        problem: 'Maximum Subarray',
        host: 'mike_algo',
        participants: 2,
        maxParticipants: 4,
        status: 'active',
        difficulty: 'medium',
        language: 'JavaScript',
        createdAt: new Date(Date.now() - 900000), // 15 minutes ago
        estimatedDuration: '45 min'
      },
      {
        id: '3',
        title: 'Tree Traversal Practice',
        problem: 'Binary Tree Level Order Traversal',
        host: 'sarah_dev',
        participants: 1,
        maxParticipants: 3,
        status: 'waiting',
        difficulty: 'medium',
        language: 'Java',
        createdAt: new Date(Date.now() - 600000), // 10 minutes ago
        estimatedDuration: '40 min'
      },
      {
        id: '4',
        title: 'Graph Algorithms Workshop',
        problem: 'Number of Islands',
        host: 'david_pro',
        participants: 4,
        maxParticipants: 6,
        status: 'active',
        difficulty: 'hard',
        language: 'C++',
        createdAt: new Date(Date.now() - 1200000), // 20 minutes ago
        estimatedDuration: '60 min'
      }
    ]

    setSessions(mockSessions)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'bg-yellow-100 text-yellow-800'
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-success-100 text-success-800'
      case 'medium':
        return 'bg-warning-100 text-warning-800'
      case 'hard':
        return 'bg-error-100 text-error-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredSessions = sessions.filter(session => {
    const matchesFilter = filter === 'all' || session.status === filter
    const matchesSearch = session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         session.problem.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         session.host.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const joinSession = (sessionId: string) => {
    router.push(`/collaborate/${sessionId}`)
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
              <Users className="w-6 h-6 text-primary-600" />
              <span className="text-lg font-bold text-gray-900">Collaborative Coding</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="card text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">{sessions.length}</div>
            <div className="text-gray-600">Active Sessions</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-success-600 mb-2">
              {sessions.filter(s => s.status === 'active').length}
            </div>
            <div className="text-gray-600">Currently Running</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-warning-600 mb-2">
              {sessions.reduce((sum, s) => sum + s.participants, 0)}
            </div>
            <div className="text-gray-600">Total Participants</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {sessions.filter(s => s.host === user.username).length}
            </div>
            <div className="text-gray-600">Your Sessions</div>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="card mb-6"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search sessions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Sessions</option>
                <option value="waiting">Waiting</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Session
            </button>
          </div>
        </motion.div>

        {/* Sessions Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredSessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => joinSession(session.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{session.title}</h3>
                  <p className="text-sm text-gray-600">{session.problem}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(session.status)}`}>
                  {session.status}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Host</span>
                  <span className="font-medium">{session.host}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Participants</span>
                  <span className="font-medium">{session.participants}/{session.maxParticipants}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Language</span>
                  <span className="font-medium">{session.language}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">{session.estimatedDuration}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(session.difficulty)}`}>
                    {session.difficulty}
                  </span>
                  <span className="text-xs text-gray-500">
                    {Math.floor((Date.now() - session.createdAt.getTime()) / 60000)}m ago
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{session.participants} joined</span>
                  </div>
                  <button className="btn-primary text-sm px-3 py-1">
                    {session.status === 'waiting' ? 'Join' : 'View'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredSessions.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center py-12"
          >
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || filter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Be the first to create a collaborative coding session!'
              }
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              Create Session
            </button>
          </motion.div>
        )}

        {/* Quick Start Guide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Get Started</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Plus className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Create a Session</h3>
              <p className="text-gray-600 text-sm">
                Start a new collaborative coding session and invite others to join
              </p>
            </div>
            <div className="card text-center">
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-success-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Join Others</h3>
              <p className="text-gray-600 text-sm">
                Browse available sessions and join ones that match your interests
              </p>
            </div>
            <div className="card text-center">
              <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Code className="w-6 h-6 text-warning-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Code Together</h3>
              <p className="text-gray-600 text-sm">
                Use the real-time collaborative editor to solve problems as a team
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
