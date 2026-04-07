import { useEffect, useRef } from 'react'
import type { FeedbackKind, Question } from '../domain/types'
import { selectDisplaySeconds } from '../app/selectors'
import { AnswerButton } from './AnswerButton'
import { ProgressBar } from './ProgressBar'
import styles from './QuizScreen.module.css'

interface QuizScreenProps {
  question: Question
  questionNumber: number
  totalQuestions: number
  score: number
  currentStreak: number
  remainingMs: number
  progressPercent: number
  feedbackKind: FeedbackKind
  selectedAnswerIndex: number | null
  isLocked: boolean
  currentToken: string | null
  onAnswer: (answerIndex: number, token: string) => void
}

const FEEDBACK_MESSAGES: Record<FeedbackKind, string> = {
  correct: '✓ Correct!',
  incorrect: '✗ Wrong answer',
  timeout: "⏱ Time's up!",
  none: '',
}

export function QuizScreen({
  question, questionNumber, totalQuestions, score, currentStreak,
  remainingMs, progressPercent, feedbackKind, selectedAnswerIndex, isLocked,
  currentToken, onAnswer,
}: QuizScreenProps) {
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => { headingRef.current?.focus() }, [question.id])

  const displaySeconds = selectDisplaySeconds(remainingMs)
  const isUrgent = displaySeconds <= 5 && !isLocked

  return (
    <main className={styles.screen}>
      <div className={styles.header}>
        <span className={styles.score}>Score: {score}</span>
        {currentStreak > 1 && (
          <span className={styles.streak} aria-live="polite">🔥 {currentStreak} streak</span>
        )}
        <span
          className={`${styles.timer} ${isUrgent ? styles.timerUrgent : ''}`}
          aria-label={`${displaySeconds} seconds remaining`}
        >
          {displaySeconds}s
        </span>
      </div>

      <ProgressBar percent={progressPercent} label={`Question ${questionNumber} of ${totalQuestions}`} />

      <section className={styles.questionCard}>
        <p className={styles.questionCount}>
          Question {questionNumber} of {totalQuestions}
        </p>
        <h2 className={styles.prompt} ref={headingRef} tabIndex={-1}>
          {question.prompt}
        </h2>
        <div className={styles.answers} role="group" aria-label="Answer options">
          {question.answers.map((answer, i) => (
            <AnswerButton
              key={i}
              label={answer}
              index={i}
              feedbackKind={feedbackKind}
              selectedAnswerIndex={selectedAnswerIndex}
              correctAnswerIndex={question.correctAnswerIndex}
              isLocked={isLocked}
              onSelect={idx => {
                if (!isLocked && currentToken) onAnswer(idx, currentToken)
              }}
            />
          ))}
        </div>
      </section>

      {feedbackKind !== 'none' && (
        <div
          role="status"
          aria-live="polite"
          className={`${styles.feedbackBanner} ${
            feedbackKind === 'correct' ? styles.feedbackCorrect :
            feedbackKind === 'incorrect' ? styles.feedbackIncorrect :
            styles.feedbackTimeout
          }`}
        >
          {FEEDBACK_MESSAGES[feedbackKind]}
        </div>
      )}
    </main>
  )
}
