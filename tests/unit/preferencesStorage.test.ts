import { describe, it, expect, beforeEach } from 'vitest'
import { readPreferences, writePreferences } from '../../src/storage/preferencesStorage'

beforeEach(() => localStorage.clear())

describe('readPreferences', () => {
  it('returns empty object when nothing stored', () => {
    expect(readPreferences()).toEqual({})
  })
  it('returns empty object on malformed JSON', () => {
    localStorage.setItem('quizArena.preferences.v1', 'bad')
    expect(readPreferences()).toEqual({})
  })
  it('returns saved category and difficulty', () => {
    writePreferences('science', 'hard')
    const prefs = readPreferences()
    expect(prefs.lastCategoryId).toBe('science')
    expect(prefs.lastDifficulty).toBe('hard')
  })
  it('ignores invalid difficulty value', () => {
    localStorage.setItem('quizArena.preferences.v1', JSON.stringify({ schemaVersion: 1, lastDifficulty: 'extreme' }))
    expect(readPreferences().lastDifficulty).toBeUndefined()
  })
})
