import type { FeedbackKind } from '../domain/types'
import styles from '../styles/feedback.module.css'

interface AnswerButtonProps {
  label: string
  index: number
  feedbackKind: FeedbackKind
  selectedAnswerIndex: number | null
  correctAnswerIndex: number
  isLocked: boolean
  onSelect: (index: number) => void
}

export function AnswerButton({
  label, index, feedbackKind, selectedAnswerIndex, correctAnswerIndex, isLocked, onSelect,
}: AnswerButtonProps) {
  const isSelected = selectedAnswerIndex === index
  const isCorrect = correctAnswerIndex === index

  let stateClass = ''
  if (isLocked) {
    if (feedbackKind === 'correct' && isSelected) stateClass = styles.correct ?? ''
    else if (feedbackKind === 'incorrect' && isSelected) stateClass = styles.incorrect ?? ''
    else if ((feedbackKind === 'incorrect' || feedbackKind === 'timeout') && isCorrect) stateClass = styles.revealed ?? ''
    else if (feedbackKind === 'timeout' && !isCorrect) stateClass = styles.timeout ?? ''
  }

  const labelPrefix = ['A', 'B', 'C', 'D'][index] ?? String(index + 1)

  return (
    <button
      className={`${styles.answerBase ?? ''} ${stateClass}`}
      disabled={isLocked}
      onClick={() => onSelect(index)}
      aria-pressed={isSelected}
    >
      <span aria-hidden="true"><strong>{labelPrefix}.</strong> </span>
      {label}
      {isLocked && isCorrect && feedbackKind !== 'correct' && (
        <span aria-label="correct answer"> ✓</span>
      )}
    </button>
  )
}
