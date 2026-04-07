import type { Difficulty, FeedbackKind, Question, QuizSession, QuizSessionSummary, LeaderboardEntry } from '../domain/types'
import { computeScore } from '../domain/scoring'
import { getDurationMs, makeQuestionToken } from '../domain/timer'
import { getQuestionsByCategory } from '../data/questionBank'
import { readLeaderboard, sortLeaderboard, writeLeaderboard } from '../storage/leaderboardStorage'

export interface QuizState {
  session: QuizSession | null
  questions: Question[]
  feedbackKind: FeedbackKind
  selectedAnswerIndex: number | null
  isLocked: boolean
  currentToken: string | null
  deadlineAtMs: number | null
  summary: QuizSessionSummary | null
  leaderboard: LeaderboardEntry[]
}

export type QuizAction =
  | { type: 'START_QUIZ'; payload: { playerName: string; categoryId: string; difficulty: Difficulty } }
  | { type: 'SUBMIT_ANSWER'; payload: { answerIndex: number; token: string } }
  | { type: 'TIME_EXPIRED'; payload: { token: string } }
  | { type: 'ADVANCE_QUESTION' }
  | { type: 'REPLAY' }

export const INITIAL_STATE: QuizState = {
  session: null,
  questions: [],
  feedbackKind: 'none',
  selectedAnswerIndex: null,
  isLocked: false,
  currentToken: null,
  deadlineAtMs: null,
  summary: null,
  leaderboard: [],
}

function makeSummary(session: QuizSession): QuizSessionSummary {
  const now = Date.now()
  const endTimeMs = session.endTimeMs ?? now
  return {
    playerName: session.playerName,
    score: session.score,
    correctCount: session.correctCount,
    incorrectCount: session.incorrectCount,
    skippedCount: session.skippedCount,
    totalQuestions: session.questionIds.length,
    accuracyPercent: (session.correctCount / session.questionIds.length) * 100,
    categoryId: session.selectedCategoryId,
    difficulty: session.difficulty,
    elapsedMs: endTimeMs - session.startTimeMs,
    completedAt: new Date(endTimeMs).toISOString(),
  }
}

function buildLeaderboardEntry(summary: QuizSessionSummary): LeaderboardEntry {
  return {
    entryId: `lb_${summary.completedAt}_${Math.random().toString(36).slice(2, 6)}`,
    playerName: summary.playerName || 'Anonymous',
    score: summary.score,
    accuracy: Math.round(summary.accuracyPercent * 10) / 10,
    categoryId: summary.categoryId,
    difficulty: summary.difficulty,
    completedAt: summary.completedAt,
    elapsedMs: summary.elapsedMs,
  }
}

export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'START_QUIZ': {
      const { playerName, categoryId, difficulty } = action.payload
      const questions = getQuestionsByCategory(categoryId)
      const token = makeQuestionToken()
      const now = Date.now()
      const durationMs = getDurationMs(difficulty)
      const session: QuizSession = {
        sessionId: makeQuestionToken(),
        playerName: playerName.trim() || 'Anonymous',
        selectedCategoryId: categoryId,
        difficulty,
        questionIds: questions.map(q => q.id),
        currentQuestionIndex: 0,
        score: 0,
        correctCount: 0,
        incorrectCount: 0,
        skippedCount: 0,
        currentStreak: 0,
        maxStreak: 0,
        startTimeMs: now,
        endTimeMs: null,
        status: 'active',
      }
      return {
        ...state,
        session,
        questions,
        feedbackKind: 'none',
        selectedAnswerIndex: null,
        isLocked: false,
        currentToken: token,
        deadlineAtMs: now + durationMs,
        summary: null,
      }
    }

    case 'SUBMIT_ANSWER': {
      if (!state.session || state.isLocked) return state
      if (action.payload.token !== state.currentToken) return state
      const { session, questions } = state
      const question = questions[session.currentQuestionIndex]
      if (!question) return state
      const isCorrect = action.payload.answerIndex === question.correctAnswerIndex
      const { awardedPoints, nextStreak } = computeScore({
        result: isCorrect ? 'correct' : 'incorrect',
        basePoints: question.basePoints,
        currentStreak: session.currentStreak,
      })
      const updatedSession: QuizSession = {
        ...session,
        score: session.score + awardedPoints,
        correctCount: isCorrect ? session.correctCount + 1 : session.correctCount,
        incorrectCount: isCorrect ? session.incorrectCount : session.incorrectCount + 1,
        currentStreak: nextStreak,
        maxStreak: Math.max(session.maxStreak, nextStreak),
        status: 'feedback',
      }
      return {
        ...state,
        session: updatedSession,
        feedbackKind: isCorrect ? 'correct' : 'incorrect',
        selectedAnswerIndex: action.payload.answerIndex,
        isLocked: true,
        currentToken: null,
      }
    }

    case 'TIME_EXPIRED': {
      if (!state.session || state.isLocked) return state
      if (action.payload.token !== state.currentToken) return state
      const updatedSession: QuizSession = {
        ...state.session,
        skippedCount: state.session.skippedCount + 1,
        currentStreak: 0,
        status: 'feedback',
      }
      return {
        ...state,
        session: updatedSession,
        feedbackKind: 'timeout',
        selectedAnswerIndex: null,
        isLocked: true,
        currentToken: null,
      }
    }

    case 'ADVANCE_QUESTION': {
      if (!state.session) return state
      const { session, questions } = state
      const nextIndex = session.currentQuestionIndex + 1
      const isLast = nextIndex >= questions.length

      if (isLast) {
        const endTimeMs = Date.now()
        const finalSession: QuizSession = { ...session, currentQuestionIndex: nextIndex, endTimeMs, status: 'results' }
        const summary = makeSummary(finalSession)
        const entry = buildLeaderboardEntry(summary)
        const existing = readLeaderboard()
        const updated = sortLeaderboard([...existing, entry]).slice(0, 10)
        writeLeaderboard(updated)
        return {
          ...state,
          session: finalSession,
          feedbackKind: 'none',
          selectedAnswerIndex: null,
          isLocked: false,
          currentToken: null,
          deadlineAtMs: null,
          summary,
          leaderboard: updated,
        }
      }

      const token = makeQuestionToken()
      const durationMs = getDurationMs(session.difficulty)
      return {
        ...state,
        session: { ...session, currentQuestionIndex: nextIndex, status: 'active' },
        feedbackKind: 'none',
        selectedAnswerIndex: null,
        isLocked: false,
        currentToken: token,
        deadlineAtMs: Date.now() + durationMs,
      }
    }

    case 'REPLAY': {
      return {
        ...INITIAL_STATE,
        leaderboard: readLeaderboard(),
      }
    }

    default:
      return state
  }
}
