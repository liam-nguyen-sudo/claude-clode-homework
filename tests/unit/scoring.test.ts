import { describe, it, expect } from 'vitest'
import { computeScore, getMultiplier } from '../../src/domain/scoring'

describe('getMultiplier', () => {
  it('returns 1x for streak 1', () => expect(getMultiplier(1)).toBe(1))
  it('returns 1x for streak 2', () => expect(getMultiplier(2)).toBe(1))
  it('returns 2x for streak 3', () => expect(getMultiplier(3)).toBe(2))
  it('returns 2x for streak 4', () => expect(getMultiplier(4)).toBe(2))
  it('returns 3x for streak 5', () => expect(getMultiplier(5)).toBe(3))
  it('returns 3x for streak 10', () => expect(getMultiplier(10)).toBe(3))
})

describe('computeScore', () => {
  it('awards 100 for correct answer at streak 1', () => {
    const r = computeScore({ result: 'correct', basePoints: 100, currentStreak: 0 })
    expect(r.awardedPoints).toBe(100)
    expect(r.nextStreak).toBe(1)
    expect(r.multiplier).toBe(1)
  })
  it('awards 200 for correct answer at streak 3 (2x)', () => {
    const r = computeScore({ result: 'correct', basePoints: 100, currentStreak: 2 })
    expect(r.awardedPoints).toBe(200)
    expect(r.nextStreak).toBe(3)
    expect(r.multiplier).toBe(2)
  })
  it('awards 300 for correct answer at streak 5 (3x)', () => {
    const r = computeScore({ result: 'correct', basePoints: 100, currentStreak: 4 })
    expect(r.awardedPoints).toBe(300)
    expect(r.nextStreak).toBe(5)
    expect(r.multiplier).toBe(3)
  })
  it('awards 0 for incorrect answer', () => {
    const r = computeScore({ result: 'incorrect', basePoints: 100, currentStreak: 5 })
    expect(r.awardedPoints).toBe(0)
    expect(r.nextStreak).toBe(0)
    expect(r.multiplier).toBe(1)
  })
  it('awards 0 for timeout (skipped)', () => {
    const r = computeScore({ result: 'timeout', basePoints: 100, currentStreak: 5 })
    expect(r.awardedPoints).toBe(0)
    expect(r.nextStreak).toBe(0)
    expect(r.multiplier).toBe(1)
  })
})
