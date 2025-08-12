export interface Problem {
  id: string
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  topics: string[]
  constraints: string[]
  examples: Example[]
  testCases: TestCase[]
  starterCode: {
    [language: string]: string
  }
  solution: {
    [language: string]: string
  }
  hints: string[]
  timeLimit: number // in seconds
  memoryLimit: number // in MB
  points: number
  submissions: number
  acceptanceRate: number
  createdAt: Date
  updatedAt: Date
}

export interface Example {
  input: string
  output: string
  explanation?: string
}

export interface TestCase {
  id: string
  input: string
  expectedOutput: string
  isHidden: boolean
  description?: string
}

export interface ProblemSubmission {
  id: string
  problemId: string
  userId: string
  language: string
  code: string
  status: 'pending' | 'running' | 'accepted' | 'wrong_answer' | 'time_limit_exceeded' | 'memory_limit_exceeded' | 'runtime_error' | 'compilation_error'
  executionTime?: number
  memoryUsed?: number
  testCasesPassed: number
  totalTestCases: number
  errorMessage?: string
  submittedAt: Date
  judgedAt?: Date
}

export interface ProblemFilter {
  difficulty?: 'easy' | 'medium' | 'hard'
  topics?: string[]
  status?: 'solved' | 'attempted' | 'unsolved'
  search?: string
  sortBy?: 'difficulty' | 'points' | 'submissions' | 'acceptance_rate'
  sortOrder?: 'asc' | 'desc'
}
