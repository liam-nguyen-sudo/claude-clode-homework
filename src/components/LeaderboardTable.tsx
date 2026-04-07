import type { LeaderboardEntry } from '../domain/types'
import styles from './LeaderboardTable.module.css'

interface LeaderboardTableProps {
  entries: LeaderboardEntry[]
  highlightEntryId?: string
}

export function LeaderboardTable({ entries, highlightEntryId }: LeaderboardTableProps) {
  if (entries.length === 0) {
    return <p className={styles.empty}>No scores yet. Be the first!</p>
  }
  return (
    <table className={styles.table} aria-label="Top 10 leaderboard">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Player</th>
          <th scope="col">Score</th>
          <th scope="col">Accuracy</th>
          <th scope="col">Difficulty</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((entry, i) => (
          <tr
            key={entry.entryId}
            className={entry.entryId === highlightEntryId ? styles.highlight : undefined}
          >
            <td>{i + 1}</td>
            <td>{entry.playerName}</td>
            <td>{entry.score}</td>
            <td>{entry.accuracy.toFixed(1)}%</td>
            <td>{entry.difficulty}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
