import { useReducer, useEffect, useCallback } from 'react'
import { quizReducer, INITIAL_STATE } from './quizReducer'
import { selectCurrentQuestion, selectProgressPercent } from './selectors'
import { useQuestionTimer } from '../hooks/useQuestionTimer'
import { validateQuestionBank } from '../domain/validation'
import { ALL_QUESTIONS } from '../data/questionBank'
import { readPreferences, writePreferences } from '../storage/preferencesStorage'
import { LandingScreen } from '../components/LandingScreen'
import { QuizScreen } from '../components/QuizScreen'
import { ResultsScreen } from '../components/ResultsScreen'
import type { Difficulty } from '../domain/types'

const FEEDBACK_DELAY_MS = 600

// Validate question bank at startup
try {
  validateQuestionBank(ALL_QUESTIONS)
} catch (e) {
  document.body.innerHTML = `<p role="alert" style="color:red;padding:2rem;font-size:1.2rem;">
    Configuration error: ${(e as Error).message}
  </p>`
  throw e
}

export default function AppShell() {
  const [state, dispatch] = useReducer(quizReducer, INITIAL_STATE)
  const prefs = readPreferences()

  const handleTimeout = useCallback((token: string) => {
    dispatch({ type: 'TIME_EXPIRED', payload: { token } })
  }, [])

  const remainingMs = useQuestionTimer(
    state.deadlineAtMs,
    state.currentToken,
    handleTimeout,
  )

  // Auto-advance after feedback delay
  useEffect(() => {
    if (state.session?.status !== 'feedback') return
    const id = setTimeout(() => {
      dispatch({ type: 'ADVANCE_QUESTION' })
    }, FEEDBACK_DELAY_MS)
    return () => clearTimeout(id)
  }, [state.session?.status, state.session?.currentQuestionIndex])

  const question = selectCurrentQuestion(state)
  const progressPercent = selectProgressPercent(state)

  const handleStart = (playerName: string, categoryId: string, difficulty: Difficulty) => {
    writePreferences(categoryId, difficulty)
    dispatch({ type: 'START_QUIZ', payload: { playerName, categoryId, difficulty } })
  }

  const handleAnswer = (answerIndex: number, token: string) => {
    dispatch({ type: 'SUBMIT_ANSWER', payload: { answerIndex, token } })
  }

  const handleReplay = () => {
    dispatch({ type: 'REPLAY' })
  }

  const status = state.session?.status ?? 'landing'

  if (status === 'landing' || !state.session) {
    return (
      <LandingScreen
        defaultCategoryId={prefs.lastCategoryId}
        defaultDifficulty={prefs.lastDifficulty}
        onStart={handleStart}
      />
    )
  }

  if ((status === 'active' || status === 'feedback') && question) {
    return (
      <QuizScreen
        question={question}
        questionNumber={state.session.currentQuestionIndex + 1}
        totalQuestions={state.session.questionIds.length}
        score={state.session.score}
        currentStreak={state.session.currentStreak}
        remainingMs={remainingMs}
        progressPercent={progressPercent}
        feedbackKind={state.feedbackKind}
        selectedAnswerIndex={state.selectedAnswerIndex}
        isLocked={state.isLocked}
        currentToken={state.currentToken}
        onAnswer={handleAnswer}
      />
    )
  }

  if (status === 'results' && state.summary) {
    return (
      <ResultsScreen
        summary={state.summary}
        leaderboard={state.leaderboard}
        onReplay={handleReplay}
      />
    )
  }

  return null
}
