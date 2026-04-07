import { describe, it, expect, beforeEach } from 'vitest'
import { readLeaderboard, writeLeaderboard } from '../../src/storage/leaderboardStorage'
import type { LeaderboardEntry } from '../../src/domain/types'

const makeEntry = (i: number): LeaderboardEntry => ({
  entryId: `e${i}`,
  playerName: 'Player',
  score: 1000 - i * 10,
  accuracy: 100 - i,
  categoryId: 'general',
  difficulty: 'medium',
  completedAt: new Date(2026, 0, i + 1).toISOString(),
  elapsedMs: 60000 + i * 1000,
})

beforeEach(() => localStorage.clear())

describe('readLeaderboard', () => {
  it('returns empty array when nothing stored', () => {
    expect(readLeaderboard()).toEqual([])
  })
  it('returns empty array on malformed JSON', () => {
    localStorage.setItem('quizArena.leaderboard.v1', '{bad json')
    expect(readLeaderboard()).toEqual([])
  })
  it('returns empty array on wrong schema version', () => {
    localStorage.setItem('quizArena.leaderboard.v1', JSON.stringify({ schemaVersion: 99, entries: [] }))
    expect(readLeaderboard()).toEqual([])
  })
  it('filters out invalid entries', () => {
    const payload = { schemaVersion: 1, entries: [{ broken: true }, makeEntry(0)] }
    localStorage.setItem('quizArena.leaderboard.v1', JSON.stringify(payload))
    const result = readLeaderboard()
    expect(result).toHaveLength(1)
    expect(result[0]?.entryId).toBe('e0')
  })
})

describe('writeLeaderboard', () => {
  it('writes and reads back up to 10 entries', () => {
    const entries = Array.from({ length: 15 }, (_, i) => makeEntry(i))
    writeLeaderboard(entries)
    const result = readLeaderboard()
    expect(result).toHaveLength(10)
  })
  it('sorts by score descending', () => {
    const entries = [makeEntry(5), makeEntry(0), makeEntry(3)]
    writeLeaderboard(entries)
    const result = readLeaderboard()
    expect(result[0]?.score).toBeGreaterThanOrEqual(result[1]?.score ?? 0)
  })
})
