import { useEffect, useRef, useState } from 'react'
import type { Difficulty } from '../domain/types'
import { CATEGORIES } from '../data/questionBank'
import styles from './LandingScreen.module.css'

interface LandingScreenProps {
  defaultCategoryId?: string
  defaultDifficulty?: Difficulty
  onStart: (playerName: string, categoryId: string, difficulty: Difficulty) => void
}

export function LandingScreen({ defaultCategoryId, defaultDifficulty, onStart }: LandingScreenProps) {
  const [playerName, setPlayerName] = useState('')
  const [categoryId, setCategoryId] = useState(defaultCategoryId ?? '')
  const [difficulty, setDifficulty] = useState<Difficulty>(defaultDifficulty ?? 'medium')
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => { headingRef.current?.focus() }, [])

  const canStart = categoryId !== ''

  return (
    <main className={styles.screen}>
      <div className={styles.card}>
        <h1 className={styles.title} ref={headingRef} tabIndex={-1}>Quiz Arena</h1>
        <p className={styles.subtitle}>Test your knowledge. Beat the clock. Top the board.</p>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="playerName">Display name (optional)</label>
          <input
            id="playerName"
            className={styles.input}
            type="text"
            placeholder="Anonymous"
            value={playerName}
            onChange={e => setPlayerName(e.target.value)}
            maxLength={32}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="category">Category</label>
          <select
            id="category"
            className={styles.select}
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
          >
            <option value="">— Select a category —</option>
            {CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.label}</option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="difficulty">Difficulty</label>
          <select
            id="difficulty"
            className={styles.select}
            value={difficulty}
            onChange={e => setDifficulty(e.target.value as Difficulty)}
          >
            <option value="easy">Easy (20s per question)</option>
            <option value="medium">Medium (15s per question)</option>
            <option value="hard">Hard (10s per question)</option>
          </select>
        </div>

        <button
          className={styles.startButton}
          disabled={!canStart}
          onClick={() => onStart(playerName, categoryId, difficulty)}
        >
          Start Quiz
        </button>
      </div>
    </main>
  )
}
