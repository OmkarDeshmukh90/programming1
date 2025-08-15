'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Code, 
  Trophy, 
  TrendingUp, 
  Target, 
  Clock, 
  CheckCircle, 
  XCircle,
  Play,
  BookOpen,
  Users,
  Star
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalProblems: 0,
    solvedProblems: 0,
    currentStreak: 0,
    totalPoints: 0,
    rank: 0,
    accuracy: 0
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      // Fetch user stats
      fetchUserStats()
    }
  }, [user])

  const fetchUserStats = async () => {
    try {
      const response = await fetch('/api/user/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch user stats:', error)
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

  const recentProblems = [
    { id: '1', title: 'Two Sum', difficulty: 'easy', status: 'solved', points: 10 },
    { id: '2', title: 'Add Two Numbers', difficulty: 'medium', status: 'attempted', points: 20 },
    { id: '3', title: 'Longest Substring', difficulty: 'hard', status: 'unsolved', points: 30 },
  ]

  const achievements = [
    { id: '1', name: 'First Problem', description: 'Solved your first coding problem', icon: '🎯', unlocked: true },
    { id: '2', name: 'Streak Master', description: 'Maintained a 7-day streak', icon: '🔥', unlocked: true },
    { id: '3', name: 'Speed Demon', description: 'Solved 5 problems in one day', icon: '⚡', unlocked: false },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Code className="w-8 h-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">Programming+</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user.username}!</span>
              <Link href="/profile" className="btn-secondary">Profile</Link>
              <Link href="/collaborate" className="btn-secondary">Collaborate</Link>
              <Link href="/leaderboard" className="btn-secondary">Leaderboard</Link>
              <Link href="/learn" className="btn-secondary">Learning</Link>
              <Link href="/problems" className="btn-primary">New Problem</Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.username}! 👋
          </h1>
          <p className="text-gray-600">
            Ready to tackle today's coding challenges? Let's keep that streak going!
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="card"
          >
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Trophy className="w-6 h-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Points</p>
                <p className="text-2xl font-bold text-gray-900">{user.points}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="card"
          >
            <div className="flex items-center">
              <div className="p-2 bg-success-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Current Streak</p>
                <p className="text-2xl font-bold text-gray-900">{user.streak} days</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="card"
          >
            <div className="flex items-center">
              <div className="p-2 bg-warning-100 rounded-lg">
                <Target className="w-6 h-6 text-warning-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Problems Solved</p>
                <p className="text-2xl font-bold text-gray-900">{user.solvedProblems}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="card"
          >
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Level</p>
                <p className="text-2xl font-bold text-gray-900">{user.level}</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Problems */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="lg:col-span-2"
          >
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Problems</h2>
                <Link href="/problems" className="text-primary-600 hover:text-primary-500 text-sm font-medium">
                  View all
                </Link>
              </div>
              <div className="space-y-4">
                {recentProblems.map((problem) => (
                  <div key={problem.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        problem.status === 'solved' ? 'bg-success-500' : 
                        problem.status === 'attempted' ? 'bg-warning-500' : 'bg-gray-300'
                      }`} />
                      <div>
                        <h3 className="font-medium text-gray-900">{problem.title}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            problem.difficulty === 'easy' ? 'bg-success-100 text-success-800' :
                            problem.difficulty === 'medium' ? 'bg-warning-100 text-warning-800' :
                            'bg-error-100 text-error-800'
                          }`}>
                            {problem.difficulty}
                          </span>
                          <span>{problem.points} pts</span>
                        </div>
                      </div>
                    </div>
                    <Link href={`/problems/${problem.id}`} className="btn-primary">
                      {problem.status === 'solved' ? 'Review' : 'Solve'}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="space-y-6"
          >
            {/* Quick Actions */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link href="/problems" className="flex items-center space-x-3 p-3 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
                  <Play className="w-5 h-5 text-primary-600" />
                  <span className="font-medium text-primary-700">Start New Problem</span>
                </Link>
                <Link href="/learn" className="flex items-center space-x-3 p-3 bg-success-50 rounded-lg hover:bg-success-100 transition-colors">
                  <BookOpen className="w-5 h-5 text-success-600" />
                  <span className="font-medium text-success-700">Learning Path</span>
                </Link>
                <Link href="/collaborate" className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                  <Users className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-purple-700">Collaborate</span>
                </Link>
                <Link href="/leaderboard" className="flex items-center space-x-3 p-3 bg-warning-50 rounded-lg hover:bg-warning-100 transition-colors">
                  <Users className="w-5 h-5 text-warning-600" />
                  <span className="font-medium text-warning-700">Leaderboard</span>
                </Link>
              </div>
            </div>

            {/* Achievements */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
              <div className="space-y-3">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className={`flex items-center space-x-3 p-3 rounded-lg ${
                    achievement.unlocked ? 'bg-success-50' : 'bg-gray-50'
                  }`}>
                    <span className="text-2xl">{achievement.icon}</span>
                    <div className="flex-1">
                      <h4 className={`font-medium ${
                        achievement.unlocked ? 'text-success-800' : 'text-gray-600'
                      }`}>
                        {achievement.name}
                      </h4>
                      <p className={`text-sm ${
                        achievement.unlocked ? 'text-success-600' : 'text-gray-500'
                      }`}>
                        {achievement.description}
                      </p>
                    </div>
                    {achievement.unlocked && (
                      <CheckCircle className="w-5 h-5 text-success-600" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
