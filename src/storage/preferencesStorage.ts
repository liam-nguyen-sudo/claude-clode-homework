import type { Difficulty, UserPreferences } from '../domain/types'

const KEY = 'quizArena.preferences.v1'
const SCHEMA_VERSION = 1

const VALID_DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard']

function isValidDifficulty(d: unknown): d is Difficulty {
  return VALID_DIFFICULTIES.includes(d as Difficulty)
}

export function readPreferences(): Partial<Pick<UserPreferences, 'lastCategoryId' | 'lastDifficulty'>> {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return {}
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return {}
    const prefs = parsed as Record<string, unknown>
    if (prefs['schemaVersion'] !== SCHEMA_VERSION) return {}
    return {
      lastCategoryId: typeof prefs['lastCategoryId'] === 'string' ? prefs['lastCategoryId'] : undefined,
      lastDifficulty: isValidDifficulty(prefs['lastDifficulty']) ? prefs['lastDifficulty'] : undefined,
    }
  } catch {
    return {}
  }
}

export function writePreferences(categoryId: string, difficulty: Difficulty): void {
  try {
    const payload: UserPreferences = {
      schemaVersion: SCHEMA_VERSION,
      lastCategoryId: categoryId,
      lastDifficulty: difficulty,
      updatedAt: new Date().toISOString(),
    }
    localStorage.setItem(KEY, JSON.stringify(payload))
  } catch {
    // storage unavailable — continue silently
  }
}
