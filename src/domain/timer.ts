import type { Difficulty } from './types'

export const DIFFICULTY_DURATION_MS: Record<Difficulty, number> = {
  easy: 20_000,
  medium: 15_000,
  hard: 10_000,
}

export function getDurationMs(difficulty: Difficulty): number {
  return DIFFICULTY_DURATION_MS[difficulty]
}

export function computeRemainingMs(deadlineAtMs: number): number {
  return Math.max(0, deadlineAtMs - Date.now())
}

export function makeQuestionToken(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}
