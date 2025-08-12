export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  points: number
  streak: number
  level: number
  solvedProblems: number
  totalSubmissions: number
  joinDate: Date
  lastActive: Date
  preferences: {
    theme: 'light' | 'dark' | 'auto'
    language: 'en' | 'es' | 'fr' | 'de'
    notifications: boolean
  }
  skills: {
    [topic: string]: {
      level: number
      problemsSolved: number
      averageScore: number
    }
  }
}

export interface UserProfile extends User {
  bio?: string
  socialLinks?: {
    github?: string
    linkedin?: string
    twitter?: string
  }
  achievements: Achievement[]
  learningPath: LearningPathItem[]
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt: Date
  points: number
}

export interface LearningPathItem {
  id: string
  topic: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  status: 'not_started' | 'in_progress' | 'completed'
  progress: number
  nextProblemId?: string
}
