import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { render, screen, act, fireEvent } from '@testing-library/react'
import AppShell from '../../src/app/AppShell'

beforeEach(() => {
  localStorage.clear()
  vi.useFakeTimers({ shouldAdvanceTime: false })
})

afterEach(() => {
  vi.useRealTimers()
})

/** Helper: select a <select> option using fireEvent to avoid timer issues */
function selectOption(labelText: RegExp | string, value: string) {
  const el = screen.getByLabelText(labelText)
  fireEvent.change(el, { target: { value } })
}

/** Helper: click a button using fireEvent */
function clickButton(name: RegExp | string) {
  fireEvent.click(screen.getByRole('button', { name }))
}

/** Helper: get the four answer buttons (prefixed A./B./C./D.) */
function getAnswerButtons() {
  return screen.getAllByRole('button').filter(b => /^[ABCD]\./.test(b.textContent ?? ''))
}

/**
 * Advance fake timers and flush React's internal state updates.
 * Uses act() to ensure React processes all pending state changes from timer callbacks.
 */
async function advanceAndFlush(ms: number) {
  await act(async () => {
    vi.advanceTimersByTime(ms)
  })
}

describe('Landing screen', () => {
  it('renders the app title', () => {
    render(<AppShell />)
    expect(screen.getByText('Quiz Arena')).toBeInTheDocument()
  })

  it('start button is disabled until category is selected', () => {
    render(<AppShell />)
    expect(screen.getByRole('button', { name: /start quiz/i })).toBeDisabled()
  })

  it('enables start button after category selection', () => {
    render(<AppShell />)
    selectOption(/category/i, 'general-knowledge')
    expect(screen.getByRole('button', { name: /start quiz/i })).not.toBeDisabled()
  })
})

describe('Quiz flow', () => {
  it('shows first question after start', () => {
    render(<AppShell />)
    selectOption(/category/i, 'general-knowledge')
    clickButton(/start quiz/i)
    expect(screen.getByText(/question 1 of/i)).toBeInTheDocument()
  })

  it('renders exactly 4 answer buttons', () => {
    render(<AppShell />)
    selectOption(/category/i, 'general-knowledge')
    clickButton(/start quiz/i)
    expect(getAnswerButtons()).toHaveLength(4)
  })

  it('shows feedback after answering', () => {
    render(<AppShell />)
    selectOption(/category/i, 'general-knowledge')
    clickButton(/start quiz/i)
    const answerButtons = getAnswerButtons()
    fireEvent.click(answerButtons[0]!)
    // Feedback banner should appear (correct or incorrect)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('advances to next question after feedback delay', async () => {
    render(<AppShell />)
    selectOption(/category/i, 'general-knowledge')
    clickButton(/start quiz/i)
    const answerButtons = getAnswerButtons()
    fireEvent.click(answerButtons[0]!)
    // Advance timer past feedback delay (600ms)
    await advanceAndFlush(700)
    expect(screen.getByText(/question 2 of/i)).toBeInTheDocument()
  })

  it('auto-skips on timeout and shows time-up feedback', async () => {
    render(<AppShell />)
    selectOption(/category/i, 'general-knowledge')
    selectOption(/difficulty/i, 'easy')
    clickButton(/start quiz/i)
    // Advance past the easy timer (20s) + extra ticks to trigger setInterval callback
    // The timer hook fires every 200ms; after 20s deadline it fires TIME_EXPIRED
    await advanceAndFlush(21_000)
    expect(screen.queryByText(/time's up/i)).toBeInTheDocument()
  })

  it('shows results after completing all questions', async () => {
    render(<AppShell />)
    selectOption(/category/i, 'general-knowledge')
    // Use medium difficulty (15s) which is the default
    clickButton(/start quiz/i)

    // Skip all 6 questions by timing out
    for (let i = 0; i < 6; i++) {
      // Advance past the medium timer (15s) + a couple extra ticks
      await advanceAndFlush(16_000)
      expect(screen.queryByText(/time's up/i)).toBeInTheDocument()
      // Advance past the feedback auto-advance delay (600ms)
      await advanceAndFlush(700)
      if (i < 5) {
        expect(screen.queryByText(new RegExp(`question ${i + 2} of`, 'i'))).toBeInTheDocument()
      }
    }
    expect(screen.getByText(/quiz complete/i)).toBeInTheDocument()
  })

  it('shows leaderboard on results screen', async () => {
    render(<AppShell />)
    selectOption(/category/i, 'general-knowledge')
    clickButton(/start quiz/i)

    for (let i = 0; i < 6; i++) {
      await advanceAndFlush(16_000)
      await advanceAndFlush(700)
    }
    expect(screen.getByText(/quiz complete/i)).toBeInTheDocument()
    expect(screen.getByRole('table', { name: /leaderboard/i })).toBeInTheDocument()
  })

  it('replay returns to landing', async () => {
    render(<AppShell />)
    selectOption(/category/i, 'general-knowledge')
    clickButton(/start quiz/i)

    for (let i = 0; i < 6; i++) {
      await advanceAndFlush(16_000)
      await advanceAndFlush(700)
    }
    expect(screen.getByText(/quiz complete/i)).toBeInTheDocument()
    clickButton(/play again/i)
    expect(screen.getByText('Quiz Arena')).toBeInTheDocument()
  })
})
