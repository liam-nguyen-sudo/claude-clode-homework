import type { QuizState } from './quizReducer'
import type { Question } from '../domain/types'

export function selectCurrentQuestion(state: QuizState): Question | null {
  if (!state.session) return null
  return state.questions[state.session.currentQuestionIndex] ?? null
}

export function selectProgressPercent(state: QuizState): number {
  if (!state.session) return 0
  const { correctCount, incorrectCount, skippedCount, questionIds } = state.session
  const completed = correctCount + incorrectCount + skippedCount
  return (completed / questionIds.length) * 100
}

export function selectAccuracyPercent(state: QuizState): number {
  if (!state.session) return 0
  const { correctCount, questionIds } = state.session
  return (correctCount / questionIds.length) * 100
}

export function selectDisplaySeconds(remainingMs: number): number {
  return Math.ceil(remainingMs / 1000)
}
