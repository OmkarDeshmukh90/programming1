'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Trophy, 
  Medal, 
  Crown, 
  TrendingUp, 
  Users, 
  Target,
  Calendar,
  Filter
} from 'lucide-react'
import Link from 'next/link'

interface LeaderboardUser {
  id: number
  username: string
  points: number
  solvedProblems: number
  streak: number
  rank: number
  avatar?: string
}

export default function LeaderboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([])
  const [timeFilter, setTimeFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('points')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
      return
    }

    fetchLeaderboard()
  }, [user, loading, router, timeFilter, categoryFilter])

  const fetchLeaderboard = async () => {
    setIsLoading(true)
    try {
      // Mock data for now - replace with actual API call
      const mockLeaderboard: LeaderboardUser[] = [
        {
          id: 1,
          username: 'alex_coder',
          points: 2850,
          solvedProblems: 45,
          streak: 15,
          rank: 1
        },
        {
          id: 2,
          username: 'sarah_dev',
          points: 2720,
          solvedProblems: 42,
          streak: 12,
          rank: 2
        },
        {
          id: 3,
          username: 'mike_algo',
          points: 2580,
          solvedProblems: 38,
          streak: 8,
          rank: 3
        },
        {
          id: 4,
          username: 'demo_user',
          points: 1250,
          solvedProblems: 15,
          streak: 7,
          rank: 15
        },
        {
          id: 5,
          username: 'julia_tech',
          points: 2450,
          solvedProblems: 35,
          streak: 10,
          rank: 4
        },
        {
          id: 6,
          username: 'david_pro',
          points: 2320,
          solvedProblems: 32,
          streak: 6,
          rank: 5
        },
        {
          id: 7,
          username: 'emma_code',
          points: 2180,
          solvedProblems: 28,
          streak: 9,
          rank: 6
        },
        {
          id: 8,
          username: 'tom_script',
          points: 2050,
          solvedProblems: 25,
          streak: 5,
          rank: 7
        }
      ]

      setLeaderboard(mockLeaderboard)
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-500" />
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />
    if (rank === 3) return <Medal className="w-6 h-6 text-amber-600" />
    return <span className="text-lg font-bold text-gray-600">{rank}</span>
  }

  const getCurrentUserRank = () => {
    return leaderboard.find(u => u.username === user?.username)
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

  const currentUserRank = getCurrentUserRank()

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
              <Trophy className="w-6 h-6 text-primary-600" />
              <span className="text-lg font-bold text-gray-900">Leaderboard</span>
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
            <div className="text-3xl font-bold text-primary-600 mb-2">{leaderboard.length}</div>
            <div className="text-gray-600">Total Participants</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-success-600 mb-2">
              {leaderboard.reduce((sum, user) => sum + user.solvedProblems, 0)}
            </div>
            <div className="text-gray-600">Problems Solved</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-warning-600 mb-2">
              {Math.max(...leaderboard.map(u => u.streak))}
            </div>
            <div className="text-gray-600">Longest Streak</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {leaderboard.reduce((sum, user) => sum + user.points, 0).toLocaleString()}
            </div>
            <div className="text-gray-600">Total Points</div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="card mb-6"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">Filters</span>
            </div>
            <div className="flex space-x-4">
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Time</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="points">Points</option>
                <option value="problems">Problems Solved</option>
                <option value="streak">Streak</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Current User Rank */}
        {currentUserRank && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="card mb-6 bg-gradient-to-r from-primary-50 to-purple-50 border-primary-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {currentUserRank.rank}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Your Rank</h3>
                  <p className="text-gray-600">Rank #{currentUserRank.rank} out of {leaderboard.length}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary-600">{currentUserRank.points}</div>
                <div className="text-sm text-gray-600">points</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Leaderboard Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Top Performers</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span>{leaderboard.length} participants</span>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading leaderboard...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Rank</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">Points</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">Problems</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">Streak</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        user.username === currentUserRank?.username ? 'bg-primary-50' : ''
                      }`}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          {getRankIcon(user.rank)}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{user.username}</div>
                            <div className="text-sm text-gray-500">Level {Math.floor(user.points / 500) + 1}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="font-semibold text-gray-900">{user.points.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">
                          <TrendingUp className="w-3 h-3 inline mr-1" />
                          +{Math.floor(Math.random() * 50) + 10}/day
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="font-medium text-gray-900">{user.solvedProblems}</div>
                        <div className="text-sm text-gray-500">
                          <Target className="w-3 h-3 inline mr-1" />
                          {Math.floor((user.solvedProblems / 50) * 100)}% completion
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="font-medium text-gray-900">{user.streak}</div>
                        <div className="text-sm text-gray-500">
                          <Calendar className="w-3 h-3 inline mr-1" />
                          days
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Achievement Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
        >
          <div className="card text-center">
            <div className="text-4xl mb-2">🏆</div>
            <h3 className="font-semibold text-gray-900 mb-2">Weekly Champion</h3>
            <p className="text-gray-600">alex_coder</p>
            <p className="text-sm text-gray-500">2,850 points this week</p>
          </div>
          <div className="card text-center">
            <div className="text-4xl mb-2">🔥</div>
            <h3 className="font-semibold text-gray-900 mb-2">Streak Master</h3>
            <p className="text-gray-600">alex_coder</p>
            <p className="text-sm text-gray-500">15 day streak</p>
          </div>
          <div className="card text-center">
            <div className="text-4xl mb-2">⚡</div>
            <h3 className="font-semibold text-gray-900 mb-2">Speed Demon</h3>
            <p className="text-gray-600">sarah_dev</p>
            <p className="text-sm text-gray-500">5 problems in 1 day</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
