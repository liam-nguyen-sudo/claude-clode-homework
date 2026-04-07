import styles from './ProgressBar.module.css'

interface ProgressBarProps {
  percent: number
  label?: string
}

export function ProgressBar({ percent, label = 'Quiz progress' }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percent))
  return (
    <div
      className={styles.container}
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div className={styles.fill} style={{ width: `${clamped}%` }} />
    </div>
  )
}
