import type { LeaderboardEntry } from '../domain/types'

const KEY = 'quizArena.leaderboard.v1'
const SCHEMA_VERSION = 1
const LIMIT = 10

function isValidEntry(e: unknown): e is LeaderboardEntry {
  if (!e || typeof e !== 'object') return false
  const entry = e as Record<string, unknown>
  return (
    typeof entry['entryId'] === 'string' &&
    typeof entry['playerName'] === 'string' &&
    typeof entry['score'] === 'number' &&
    typeof entry['accuracy'] === 'number' &&
    typeof entry['categoryId'] === 'string' &&
    typeof entry['difficulty'] === 'string' &&
    typeof entry['completedAt'] === 'string' &&
    typeof entry['elapsedMs'] === 'number'
  )
}

export function readLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return []
    const payload = parsed as Record<string, unknown>
    if (payload['schemaVersion'] !== SCHEMA_VERSION) return []
    const entries = Array.isArray(payload['entries']) ? payload['entries'] : []
    return entries.filter(isValidEntry)
  } catch {
    return []
  }
}

export function sortLeaderboard(entries: LeaderboardEntry[]): LeaderboardEntry[] {
  return [...entries].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    if (b.accuracy !== a.accuracy) return b.accuracy - a.accuracy
    if (a.elapsedMs !== b.elapsedMs) return a.elapsedMs - b.elapsedMs
    return b.completedAt.localeCompare(a.completedAt)
  })
}

export function writeLeaderboard(entries: LeaderboardEntry[]): void {
  try {
    const sorted = sortLeaderboard(entries).slice(0, LIMIT)
    const payload = { schemaVersion: SCHEMA_VERSION, entries: sorted }
    localStorage.setItem(KEY, JSON.stringify(payload))
  } catch {
    // storage unavailable — continue silently
  }
}
