import { useEffect, useRef } from 'react'
import type { LeaderboardEntry, QuizSessionSummary } from '../domain/types'
import { LeaderboardTable } from './LeaderboardTable'
import styles from './ResultsScreen.module.css'

interface ResultsScreenProps {
  summary: QuizSessionSummary
  leaderboard: LeaderboardEntry[]
  highlightEntryId?: string
  onReplay: () => void
}

export function ResultsScreen({ summary, leaderboard, highlightEntryId, onReplay }: ResultsScreenProps) {
  const headingRef = useRef<HTMLHeadingElement>(null)
  useEffect(() => { headingRef.current?.focus() }, [])

  const elapsedSec = Math.round(summary.elapsedMs / 1000)

  return (
    <main className={styles.screen}>
      <h1 className={styles.heading} ref={headingRef} tabIndex={-1}>Quiz Complete!</h1>

      <div className={styles.card} aria-label="Your results">
        <p className={styles.scoreDisplay}>{summary.score} pts</p>
        <dl className={styles.stats}>
          <div className={styles.stat}>
            <dt className={styles.statLabel}>Correct</dt>
            <dd className={`${styles.statValue} ${styles.correct}`}>{summary.correctCount}</dd>
          </div>
          <div className={styles.stat}>
            <dt className={styles.statLabel}>Incorrect</dt>
            <dd className={`${styles.statValue} ${styles.incorrect}`}>{summary.incorrectCount}</dd>
          </div>
          <div className={styles.stat}>
            <dt className={styles.statLabel}>Skipped</dt>
            <dd className={`${styles.statValue} ${styles.skipped}`}>{summary.skippedCount}</dd>
          </div>
          <div className={styles.stat}>
            <dt className={styles.statLabel}>Accuracy</dt>
            <dd className={styles.statValue}>{summary.accuracyPercent.toFixed(1)}%</dd>
          </div>
          <div className={styles.stat}>
            <dt className={styles.statLabel}>Category</dt>
            <dd className={styles.statValue}>{summary.categoryId}</dd>
          </div>
          <div className={styles.stat}>
            <dt className={styles.statLabel}>Difficulty</dt>
            <dd className={styles.statValue}>{summary.difficulty}</dd>
          </div>
          <div className={styles.stat}>
            <dt className={styles.statLabel}>Time</dt>
            <dd className={styles.statValue}>{elapsedSec}s</dd>
          </div>
        </dl>
      </div>

      <h2 className={styles.sectionTitle}>Leaderboard</h2>
      <LeaderboardTable entries={leaderboard} highlightEntryId={highlightEntryId} />

      <button className={styles.replayButton} onClick={onReplay}>
        Play Again
      </button>
    </main>
  )
}
