import { describe, it, expect } from 'vitest'
import { validateQuestion, validateQuestionBank } from '../../src/domain/validation'
import type { Question } from '../../src/domain/types'

const valid: Question = {
  id: 'q1',
  categoryId: 'general',
  prompt: 'Question?',
  answers: ['A', 'B', 'C', 'D'],
  correctAnswerIndex: 0,
  basePoints: 100,
}

describe('validateQuestion', () => {
  it('accepts a valid question', () => {
    expect(validateQuestion(valid)).toBe(true)
  })
  it('rejects missing id', () => {
    expect(validateQuestion({ ...valid, id: '' })).toBe(false)
  })
  it('rejects missing prompt', () => {
    expect(validateQuestion({ ...valid, prompt: '' })).toBe(false)
  })
  it('rejects wrong answer count', () => {
    const bad = { ...valid, answers: ['A', 'B', 'C'] as unknown as [string,string,string,string] }
    expect(validateQuestion(bad)).toBe(false)
  })
  it('rejects empty answer string', () => {
    expect(validateQuestion({ ...valid, answers: ['A', '', 'C', 'D'] })).toBe(false)
  })
  it('rejects out-of-range correctAnswerIndex', () => {
    expect(validateQuestion({ ...valid, correctAnswerIndex: 4 as 0 })).toBe(false)
  })
  it('rejects non-positive basePoints', () => {
    expect(validateQuestion({ ...valid, basePoints: 0 })).toBe(false)
  })
})

describe('validateQuestionBank', () => {
  it('rejects fewer than 10 questions', () => {
    const questions = Array.from({ length: 9 }, (_, i) => ({ ...valid, id: `q${i}` }))
    expect(() => validateQuestionBank(questions)).toThrow()
  })
  it('rejects fewer than 2 categories', () => {
    const questions = Array.from({ length: 10 }, (_, i) => ({ ...valid, id: `q${i}` }))
    expect(() => validateQuestionBank(questions)).toThrow()
  })
  it('accepts valid bank with 10+ questions and 2+ categories', () => {
    const questions = [
      ...Array.from({ length: 5 }, (_, i) => ({ ...valid, id: `a${i}`, categoryId: 'cat-a' })),
      ...Array.from({ length: 5 }, (_, i) => ({ ...valid, id: `b${i}`, categoryId: 'cat-b' })),
    ]
    expect(() => validateQuestionBank(questions)).not.toThrow()
  })
})
