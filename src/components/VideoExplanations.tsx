'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Settings,
  Clock,
  User,
  ThumbsUp,
  ThumbsDown,
  Share,
  Download,
  Bookmark,
  BookmarkPlus
} from 'lucide-react'

interface VideoExplanation {
  id: string
  title: string
  description: string
  duration: string
  instructor: string
  views: number
  likes: number
  dislikes: number
  thumbnail: string
  videoUrl?: string
  youtubeId?: string
  difficulty: 'easy' | 'medium' | 'hard'
  topics: string[]
  transcript?: string
}

interface VideoExplanationsProps {
  problemId: string
  problemTitle: string
}

export default function VideoExplanations({ problemId, problemTitle }: VideoExplanationsProps) {
  const [videos, setVideos] = useState<VideoExplanation[]>([])
  const [selectedVideo, setSelectedVideo] = useState<VideoExplanation | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showTranscript, setShowTranscript] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)

  useEffect(() => {
    fetchVideoExplanations()
  }, [problemId])

  const fetchVideoExplanations = async () => {
    // Mock data (YouTube) - replace with actual API response later
    // Note: Thumbnails are pulled from YouTube's static image service
    const mockVideos: VideoExplanation[] = [
      {
        id: '1',
        title: 'Two Sum - Optimal HashMap Approach',
        description: 'Step-by-step explanation of Two Sum using a hash map in O(n) time with edge cases.',
        duration: '11:02',
        instructor: 'Instructor',
        views: 15420,
        likes: 892,
        dislikes: 23,
        thumbnail: 'https://img.youtube.com/vi/KLlXCFG5TnA/hqdefault.jpg',
        youtubeId: 'KLlXCFG5TnA',
        difficulty: 'easy',
        topics: ['Arrays', 'Hash Tables', 'Two Pointers'],
        transcript: `We solve Two Sum using a single pass with a hash map to store complements.`
      },
      {
        id: '2',
        title: 'Two Sum - Brute Force to Optimal',
        description: 'Compare brute force, sorting, and hash map solutions; complexity analysis included.',
        duration: '15:45',
        instructor: 'Instructor',
        views: 8920,
        likes: 456,
        dislikes: 12,
        thumbnail: 'https://img.youtube.com/vi/wiGpQwVHdE0/hqdefault.jpg',
        youtubeId: 'wiGpQwVHdE0',
        difficulty: 'medium',
        topics: ['Arrays', 'Sorting', 'Two Pointers', 'Edge Cases']
      },
      {
        id: '3',
        title: 'Two Sum - Deep Dive and Pitfalls',
        description: 'Common pitfalls, integer overflow edge cases, and memory tradeoffs.',
        duration: '19:12',
        instructor: 'Instructor',
        views: 5430,
        likes: 234,
        dislikes: 8,
        thumbnail: 'https://img.youtube.com/vi/XKu_SEDAykw/hqdefault.jpg',
        youtubeId: 'XKu_SEDAykw',
        difficulty: 'hard',
        topics: ['Optimization', 'Performance Analysis', 'Memory Management']
      }
    ]

    setVideos(mockVideos)
    if (mockVideos.length > 0) {
      setSelectedVideo(mockVideos[0])
    }
  }

  const handleVideoSelect = (video: VideoExplanation) => {
    setSelectedVideo(video)
    setIsPlaying(false)
    setCurrentTime(0)
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const handleTimeUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTime(parseFloat(e.target.value))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
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

  if (!selectedVideo) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading video explanations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Video Explanations</h2>
        <p className="text-gray-600">Learn from expert explanations and walkthroughs</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Video Player */}
        <div className="lg:col-span-2">
          {selectedVideo ? (
            <div className="space-y-4">
              {/* Video Player */}
              <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                {selectedVideo.youtubeId ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=0&rel=0`}
                    title={selectedVideo.title}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center text-white">
                      <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">Video not available</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Video Info */}
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-gray-900">{selectedVideo.title}</h3>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {selectedVideo.instructor}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {selectedVideo.duration}
                    </span>
                    <span>{selectedVideo.views.toLocaleString()} views</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setIsBookmarked(!isBookmarked)}
                      className={`p-2 rounded-lg transition-colors ${
                        isBookmarked 
                          ? 'bg-primary-100 text-primary-600' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {isBookmarked ? <BookmarkPlus className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                    </button>
                    <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                      <Share className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-700">{selectedVideo.description}</p>
                
                {/* Difficulty and Topics */}
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedVideo.difficulty === 'easy' ? 'bg-success-100 text-success-800' :
                    selectedVideo.difficulty === 'medium' ? 'bg-warning-100 text-warning-800' :
                    'bg-error-100 text-error-800'
                  }`}>
                    {selectedVideo.difficulty}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedVideo.topics.map((topic) => (
                      <span key={topic} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Transcript */}
                {selectedVideo.transcript && (
                  <div className="mt-4">
                    <button
                      onClick={() => setShowTranscript(!showTranscript)}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      {showTranscript ? 'Hide' : 'Show'} Transcript
                    </button>
                    {showTranscript && (
                      <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm text-gray-700">
                        {selectedVideo.transcript}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Select a video to start learning</p>
            </div>
          )}
        </div>

        {/* Video List */}
        <div className="space-y-4 max-h-[600px] overflow-y-auto">
          <h3 className="text-lg font-semibold text-gray-900">Available Videos</h3>
          {videos.map((video) => (
            <div
              key={video.id}
              onClick={() => setSelectedVideo(video)}
              className={`cursor-pointer rounded-lg border transition-all duration-200 ${
                selectedVideo?.id === video.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="p-4">
                <div className="flex space-x-3">
                  <div className="relative flex-shrink-0">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-20 h-12 object-cover rounded"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Play className="w-6 h-6 text-white drop-shadow-lg" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                      {video.title}
                    </h4>
                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                      <span>{video.duration}</span>
                      <span>•</span>
                      <span>{video.views.toLocaleString()} views</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        video.difficulty === 'easy' ? 'bg-success-100 text-success-800' :
                        video.difficulty === 'medium' ? 'bg-warning-100 text-warning-800' :
                        'bg-error-100 text-error-800'
                      }`}>
                        {video.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
