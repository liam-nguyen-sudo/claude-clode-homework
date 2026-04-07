export type Difficulty = 'easy' | 'medium' | 'hard'

export type SessionStatus = 'landing' | 'active' | 'feedback' | 'results'

export type FeedbackKind = 'none' | 'correct' | 'incorrect' | 'timeout'

export interface Question {
  id: string
  categoryId: string
  prompt: string
  answers: [string, string, string, string]
  correctAnswerIndex: 0 | 1 | 2 | 3
  basePoints: number
}

export interface Category {
  id: string
  label: string
}

export interface QuizSession {
  sessionId: string
  playerName: string
  selectedCategoryId: string
  difficulty: Difficulty
  questionIds: string[]
  currentQuestionIndex: number
  score: number
  correctCount: number
  incorrectCount: number
  skippedCount: number
  currentStreak: number
  maxStreak: number
  startTimeMs: number
  endTimeMs: number | null
  status: SessionStatus
}

export interface LeaderboardEntry {
  entryId: string
  playerName: string
  score: number
  accuracy: number
  categoryId: string
  difficulty: Difficulty
  completedAt: string
  elapsedMs: number
}

export interface UserPreferences {
  schemaVersion: number
  lastCategoryId?: string
  lastDifficulty?: Difficulty
  updatedAt: string
}

export interface QuizSessionSummary {
  playerName: string
  score: number
  correctCount: number
  incorrectCount: number
  skippedCount: number
  totalQuestions: number
  accuracyPercent: number
  categoryId: string
  difficulty: Difficulty
  elapsedMs: number
  completedAt: string
}

export interface StartQuizInput {
  playerName: string
  categoryId: string
  difficulty: Difficulty
}
