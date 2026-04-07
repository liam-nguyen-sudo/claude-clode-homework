import { describe, it, expect } from 'vitest'
import { getDurationMs, computeRemainingMs, makeQuestionToken } from '../../src/domain/timer'

describe('getDurationMs', () => {
  it('returns 20000 for easy', () => expect(getDurationMs('easy')).toBe(20000))
  it('returns 15000 for medium', () => expect(getDurationMs('medium')).toBe(15000))
  it('returns 10000 for hard', () => expect(getDurationMs('hard')).toBe(10000))
})

describe('computeRemainingMs', () => {
  it('returns positive ms when deadline is in the future', () => {
    const deadline = Date.now() + 5000
    expect(computeRemainingMs(deadline)).toBeGreaterThan(4000)
  })
  it('returns 0 when deadline has passed', () => {
    const deadline = Date.now() - 1000
    expect(computeRemainingMs(deadline)).toBe(0)
  })
})

describe('makeQuestionToken', () => {
  it('returns unique values', () => {
    expect(makeQuestionToken()).not.toBe(makeQuestionToken())
  })
})
