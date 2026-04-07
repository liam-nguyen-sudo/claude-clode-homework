// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { quizReducer, INITIAL_STATE, type QuizState } from '../../src/app/quizReducer'

beforeEach(() => localStorage.clear())

function startState(): QuizState {
  return quizReducer(INITIAL_STATE, {
    type: 'START_QUIZ',
    payload: { playerName: 'Tester', categoryId: 'general-knowledge', difficulty: 'easy' },
  })
}

describe('START_QUIZ', () => {
  it('sets status to active', () => {
    const state = startState()
    expect(state.session?.status).toBe('active')
  })
  it('sets deadline in future', () => {
    const state = startState()
    expect(state.deadlineAtMs).toBeGreaterThan(Date.now())
  })
  it('normalizes blank player name to Anonymous', () => {
    const state = quizReducer(INITIAL_STATE, {
      type: 'START_QUIZ',
      payload: { playerName: '   ', categoryId: 'general-knowledge', difficulty: 'easy' },
    })
    expect(state.session?.playerName).toBe('Anonymous')
  })
})

describe('SUBMIT_ANSWER', () => {
  it('awards points for correct answer', () => {
    const s1 = startState()
    const question = s1.questions[0]!
    const s2 = quizReducer(s1, {
      type: 'SUBMIT_ANSWER',
      payload: { answerIndex: question.correctAnswerIndex, token: s1.currentToken! },
    })
    expect(s2.session?.score).toBeGreaterThan(0)
    expect(s2.feedbackKind).toBe('correct')
    expect(s2.isLocked).toBe(true)
  })
  it('awards 0 for wrong answer', () => {
    const s1 = startState()
    const question = s1.questions[0]!
    const wrongIndex = ((question.correctAnswerIndex + 1) % 4) as 0 | 1 | 2 | 3
    const s2 = quizReducer(s1, {
      type: 'SUBMIT_ANSWER',
      payload: { answerIndex: wrongIndex, token: s1.currentToken! },
    })
    expect(s2.session?.score).toBe(0)
    expect(s2.feedbackKind).toBe('incorrect')
  })
  it('ignores stale token', () => {
    const s1 = startState()
    const s2 = quizReducer(s1, {
      type: 'SUBMIT_ANSWER',
      payload: { answerIndex: 0, token: 'stale-token' },
    })
    expect(s2).toBe(s1)
  })
  it('ignores when locked', () => {
    const s1 = startState()
    const q = s1.questions[0]!
    const s2 = quizReducer(s1, {
      type: 'SUBMIT_ANSWER',
      payload: { answerIndex: q.correctAnswerIndex, token: s1.currentToken! },
    })
    const s3 = quizReducer(s2, {
      type: 'SUBMIT_ANSWER',
      payload: { answerIndex: q.correctAnswerIndex, token: s2.currentToken ?? 'x' },
    })
    expect(s3.session?.score).toBe(s2.session?.score)
  })
})

describe('TIME_EXPIRED', () => {
  it('increments skippedCount and sets timeout feedback', () => {
    const s1 = startState()
    const s2 = quizReducer(s1, {
      type: 'TIME_EXPIRED',
      payload: { token: s1.currentToken! },
    })
    expect(s2.session?.skippedCount).toBe(1)
    expect(s2.feedbackKind).toBe('timeout')
    expect(s2.session?.score).toBe(0)
    expect(s2.session?.currentStreak).toBe(0)
  })
  it('ignores stale token', () => {
    const s1 = startState()
    const s2 = quizReducer(s1, {
      type: 'TIME_EXPIRED',
      payload: { token: 'stale' },
    })
    expect(s2).toBe(s1)
  })
})

describe('ADVANCE_QUESTION', () => {
  it('advances to next question', () => {
    const s1 = startState()
    const s2 = quizReducer(s1, { type: 'TIME_EXPIRED', payload: { token: s1.currentToken! } })
    const s3 = quizReducer(s2, { type: 'ADVANCE_QUESTION' })
    expect(s3.session?.currentQuestionIndex).toBe(1)
    expect(s3.feedbackKind).toBe('none')
    expect(s3.isLocked).toBe(false)
  })
  it('transitions to results after final question', () => {
    let state = startState()
    const total = state.questions.length
    for (let i = 0; i < total; i++) {
      state = quizReducer(state, { type: 'TIME_EXPIRED', payload: { token: state.currentToken! } })
      state = quizReducer(state, { type: 'ADVANCE_QUESTION' })
    }
    expect(state.session?.status).toBe('results')
    expect(state.summary).not.toBeNull()
  })
})

describe('REPLAY', () => {
  it('resets to landing state', () => {
    const s1 = startState()
    const s2 = quizReducer(s1, { type: 'REPLAY' })
    expect(s2.session).toBeNull()
    expect(s2.feedbackKind).toBe('none')
  })
})
